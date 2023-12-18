import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import esri = __esri; // Esri TypeScript Types
import Config from '@arcgis/core/config';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import Search from '@arcgis/core/widgets/Search';
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import * as route from "@arcgis/core/rest/route.js";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-esri-map",
  templateUrl: "./esri-map.component.html",
  styleUrls: ["./esri-map.component.scss"]
})
export class EsriMapComponent implements OnInit, OnDestroy {
  // The <div> where we will place the map
  @ViewChild("mapViewNode", { static: true }) private mapViewEl!: ElementRef;

  // Instances
  map!: esri.Map;
  view!: esri.MapView;
  search!: esri.Search
  pointGraphic!: esri.Graphic;
  graphicsLayer!: esri.GraphicsLayer;
  weatherData: any; // Property to store weather data

  // Attributes
  zoom = 15;
  center: Array<number> = [26.046562, 44.4379811];
  basemap = "streets-vector";
  loaded = false;
  pointCoords: number[] = [26.046562, 44.437911];
  dir: number = 0;
  count: number = 0;
  timeoutHandler = null;

  constructor(private http: HttpClient) { }

  async initializeMap() {
    try {
      // Configure the Map
      const mapProperties: esri.WebMapProperties = {
        basemap: this.basemap
      };

      Config.apiKey = "AAPK0943a115fe634f52a29648ce16dead52n9H2aVvlKq2O6aTz5IrKyqNvcBA0B2u9lvySkfA4eGgQHMuIPxrdAYK_osWYKFnm"; // Replace with your ArcGIS API key

      this.map = new WebMap(mapProperties);

      this.addFeatureLayers();

      // Initialize the MapView
      const mapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this.center,
        zoom: this.zoom,
        map: this.map
      };

      this.view = new MapView(mapViewProperties);
      const search = new Search({
        view: this.view
      });

      this.view.on('pointer-move', ["Shift"], (event) => {
        let point = this.view.toMap({ x: event.x, y: event.y });
        console.log("map moved: ", point.longitude, point.latitude);
      });

      await this.view.when(); // wait for map to load
      this.view.when(() => {
        this.view.ui.add(search, 'top-right');
      });

      // Fetch weather data based on initial map coordinates
      this.fetchWeatherData(this.center[1], this.center[0]);

      console.log("ArcGIS map loaded");
      this.addRouter();
      console.log(this.view.center);
      return this.view;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }

    return null;
  }

  addFeatureLayers() {
    // Trailheads feature layer (points)
    var trailheadsLayer: esri.FeatureLayer = new FeatureLayer({
      url:
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0"
    });

    this.map.add(trailheadsLayer);

    // Trails feature layer (lines)
    var trailsLayer: esri.FeatureLayer = new FeatureLayer({
      url:
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0"
    });

    this.map.add(trailsLayer, 0);

    // Parks and open spaces (polygons)
    var parksLayer: esri.FeatureLayer = new FeatureLayer({
      url:
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0"
    });

    this.map.add(parksLayer, 0);

    console.log("feature layers added");
  }

  addPoint(lat: number, lng: number) {
    this.graphicsLayer = new GraphicsLayer();
    this.map.add(this.graphicsLayer);

    let point = new Point({
      longitude: lng,
      latitude: lat
    });

    const simpleMarkerSymbol = {
      type: "simple-marker",
      color: [226, 119, 40],  // Orange
      outline: {
        color: [255, 255, 255], // White
        width: 1
      }
    };

    this.pointGraphic = new Graphic({
      geometry: point,
      symbol: simpleMarkerSymbol
    });

    this.graphicsLayer.add(this.pointGraphic);
  }

  removePoint() {
    if (this.pointGraphic != null) {
      this.graphicsLayer.remove(this.pointGraphic);
    }
  }

  addRouter() {
    const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

    this.view.on("click", (event) => {
      console.log("point clicked: ", event.mapPoint.latitude, event.mapPoint.longitude);
      if (this.view.graphics.length === 0) {
        addGraphic("origin", event.mapPoint);
      } else if (this.view.graphics.length === 1) {
        addGraphic("destination", event.mapPoint);
        getRoute(); // Call the route service
      } else {
        this.view.graphics.removeAll();
        addGraphic("origin", event.mapPoint);
      }
    });

    var addGraphic = (type: any, point: any) => {
      const graphic = new Graphic({
        symbol: {
          type: "simple-marker",
          color: (type === "origin") ? "white" : "black",
          size: "8px"
        } as any,
        geometry: point
      });
      this.view.graphics.add(graphic);
    }

    var getRoute = () => {
      const routeParams = new RouteParameters({
        stops: new FeatureSet({
          features: this.view.graphics.toArray()
        }),
        returnDirections: true
      });

      route.solve(routeUrl, routeParams).then((data: any) => {
        for (let result of data.routeResults) {
          result.route.symbol = {
            type: "simple-line",
            color: [5, 150, 255],
            width: 3
          };
          this.view.graphics.add(result.route);
        }

        // Display directions
        if (data.routeResults.length > 0) {
          const directions: any = document.createElement("ol");
          directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
          directions.style.marginTop = "0";
          directions.style.padding = "15px 15px 15px 30px";
          const features = data.routeResults[0].directions.features;

          let sum = 0;
          // Show each direction
          features.forEach((result: any, i: any) => {
            sum += parseFloat(result.attributes.length);
            const direction = document.createElement("li");
            direction.innerHTML = result.attributes.text + " (" + result.attributes.length + " miles)";
            directions.appendChild(direction);
          });

          sum = sum * 1.609344;
          console.log('dist (km) = ', sum);
          this.view.ui.empty("top-right");
          this.view.ui.add(directions, "top-right");
        }
      }).catch((error: any) => {
        console.log(error);
      });
    }
  }

  private weatherPopup!: HTMLDivElement;

  updateWeatherPopup() {
    if (!this.weatherPopup) {
      this.weatherPopup = document.createElement('div');
      this.weatherPopup.classList.add('weather-popup');
      this.view.ui.add(this.weatherPopup, 'bottom-right');
    }

    const data = this.weatherData?.data?.[0];
    if (data) {
      this.weatherPopup.innerHTML = `
        <strong>Weather in ${data.city_name}</strong><br>
        Temperature: ${data.temp}°C<br>
        Clouds: ${data.clouds}%<br>
        Humidity: ${data.rh}%<br>
        Wind Speed: ${data.wind_spd} m/s<br>
        <small>Last updated: ${data.ob_time}</small>
      `;
    }
  }

  private createWeatherGeoJSON(weatherData: any): __esri.GeoJSONLayer {
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [weatherData.lon, weatherData.lat]
      },
      properties: weatherData
    };
  
    const geojson = {
      type: 'FeatureCollection',
      features: [feature]
    };

    const markerSymbol = new SimpleMarkerSymbol({
      size: 25,  // Adjust the size as needed
      color: "green",  // Choose your desired color
      outline: {
        width: 0.5,
        color: "white"
      }
    });
  
    return new GeoJSONLayer({
      url: URL.createObjectURL(new Blob([JSON.stringify(geojson)], { type: 'application/json' })),
      popupTemplate: {
        title: "Weather in {city_name}",
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "temp",
                label: "Temperature (°C)",
                format: {
                  digitSeparator: true,
                  places: 1
                }
              },
              {
                fieldName: "app_temp",
                label: "Apparent Temperature (°C)",
                format: {
                  digitSeparator: true,
                  places: 1
                }
              },
              {
                fieldName: "aqi",
                label: "Air Quality Index",
                format: {
                  digitSeparator: true,
                  places: 0
                }
              },
              {
                fieldName: "clouds",
                label: "Clouds (%)",
                format: {
                  digitSeparator: true,
                  places: 0
                }
              },
              {
                fieldName: "dewpt",
                label: "Dew Point (°C)",
                format: {
                  digitSeparator: true,
                  places: 1
                }
              },
              {
                fieldName: "wind_spd",
                label: "Wind Speed (m/s)",
                format: {
                  digitSeparator: true,
                  places: 1
                }
              },
              {
                fieldName: "wind_cdir_full",
                label: "Wind Direction",
              },
              {
                fieldName: "rh",
                label: "Relative Humidity (%)",
                format: {
                  digitSeparator: true,
                  places: 0
                }
              },
              {
                fieldName: "pres",
                label: "Pressure (mb)",
                format: {
                  digitSeparator: true,
                  places: 1
                }
              },
              {
                fieldName: "uv",
                label: "UV Index",
                format: {
                  digitSeparator: true,
                  places: 2
                }
              },
              {
                fieldName: "vis",
                label: "Visibility (KM)",
                format: {
                  digitSeparator: true,
                  places: 1
                }
              },
              {
                fieldName: "weather.description",
                label: "Weather Description",
              },
              {
                fieldName: "ob_time",
                label: "Observation Time",
              }
            ]
          }
        ]
      },
      labelingInfo: [{
        symbol: {
          type: "text",  // autocasts as new TextSymbol()
          color: "green",
          haloColor: "white",
          haloSize: "1px",
          text: "Click to open weather data",
          font: {
            size: 14,
            family: "sans-serif"
          }
        },
        labelPlacement: "above-center",
        labelExpressionInfo: {
          expression: "'See weather data in Politehnica Campus'" // Static text
        }
      }],
      renderer: new SimpleRenderer({
        symbol: markerSymbol
      })
      
    });
  }
  

  // Fetch weather data based on latitude and longitude
  fetchWeatherData(lat: number, lon: number) {
    const apiKey = "1f8a81e126394525b0160c29e3fef32f"; // Replace with your OpenWeatherMap API key
    const weatherApiUrl = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${apiKey}`;

    this.http.get(weatherApiUrl).subscribe((data: any) => {
      const weatherLayer = this.createWeatherGeoJSON(data.data[0]);
      this.map.add(weatherLayer);
    });
  }

  ngOnInit() {
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then(() => {
      // The map has been initialized
      console.log("mapView ready: ", this.view.ready);
      this.loaded = this.view.ready;
    });
  }

  ngOnDestroy() {
    if (this.view) {
      // destroy the map view
      (this.view.container as any) = null;
    }
  }
}
