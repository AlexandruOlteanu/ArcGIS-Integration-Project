import {Component} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    title = 'Login';

    constructor(private router: Router) {
    }

    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                const body = document.getElementsByTagName('body')[0];
                const route = event.url.split('/')[1]; // Get the first segment of the URL (the route)
                body.classList.remove('bg-login', 'bg-admin', 'bg-home'); // Remove any existing classes
                body.classList.add('bg-' + route); // Add the appropriate class based on the current route
            }
        });
    }
}


