package ip.studentplatform.service;

import ip.studentplatform.entity.Professor;
import ip.studentplatform.entity.Student;
import ip.studentplatform.entity.User;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;

@Component
public class ExcelUploadService {

    List<User> usersList;

    @Autowired
    private EmailSenderService senderService;

    public static boolean isValidExcelFile(MultipartFile file) {
        return Objects.equals(file.getContentType(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }

    public void getCustomersDataFromExcel(InputStream inputStream) {
        try {
            this.usersList = new ArrayList<>();
            XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
            XSSFSheet sheet = workbook.getSheetAt(0);
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            for (Row row : sheet) {
                if(row.getZeroHeight()) {
                    continue;
                }
                Iterator<Cell> cellIterator = row.iterator();
                int cellIndex = 0;

                Professor userProf = null;
                Student userStudent = null;
                Cell cell = cellIterator.next();
                String data = cell.getStringCellValue();
                while (cellIterator.hasNext()) {
                    cell = cellIterator.next();
                    if (data.equals("profesor")) {
                        if (userProf == null) {
                            userProf = new Professor();
                        }

                        switch (cellIndex) {
                            case 0 -> userProf.setFirstName(cell.getStringCellValue());
                            case 1 -> userProf.setLastName(cell.getStringCellValue());
                            case 2 -> userProf.setEmail(cell.getStringCellValue());
                            case 3 -> {
                                userProf.setInitialPassword(cell.getStringCellValue());
                                userProf.setPassword(new BCryptPasswordEncoder().encode(cell.getStringCellValue()));
                            }
                            case 4 -> userProf.setUsername(cell.getStringCellValue());
                            case 5 -> userProf.setCnp(cell.getStringCellValue());
                            default -> {
                            }
                        }

                        userProf.setRole("profesor");
                        userProf.setMateries(new ArrayList<>());

                    } else {
                        if (userStudent == null) {
                            userStudent = new Student();
                        }

                        switch (cellIndex) {
                            case 0 -> userStudent.setFirstName(cell.getStringCellValue());
                            case 1 -> userStudent.setLastName(cell.getStringCellValue());
                            case 2 -> userStudent.setEmail(cell.getStringCellValue());
                            case 3 -> {
                                userStudent.setInitialPassword(cell.getStringCellValue());
                                userStudent.setPassword(new BCryptPasswordEncoder().encode(cell.getStringCellValue()));
                            }
                            case 4 -> userStudent.setUsername(cell.getStringCellValue());
                            case 5 -> userStudent.setAddress(cell.getStringCellValue());
                            case 6 -> userStudent.setGrupa(cell.getStringCellValue());
                            case 7 -> userStudent.setSerie(cell.getStringCellValue());
                            case 8 -> userStudent.setCnp(cell.getStringCellValue());
                            default -> {
                            }
                        }
                        userStudent.setRole("student");
                        userStudent.setMateries(new ArrayList<>());
                    }
                    cellIndex++;
                }
                if (data.equals("profesor")) {
                    this.usersList.add(userProf);
                } else if (data.equals("student")) {
                    this.usersList.add(userStudent);
                }
            }
        } catch (IOException e) {
            e.getStackTrace();
        }
    }
}
