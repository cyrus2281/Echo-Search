package com.ecocyrus.ecosearch;

import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.layout.GridPane;
import javafx.stage.DirectoryChooser;
import javafx.scene.control.Button;
import java.io.File;
import java.nio.file.Path;
import java.util.ArrayList;

/**
 * Controller class for the fxml file
 * @author Milad Mobini
 * https://github.com/milad2281
 */
public class Controller {
    /**
     * Holder for logo
     */
    @FXML
    private ProgressBar progressBar;
    @FXML
    private TextArea detailsResult;
    @FXML
    private Button runAppBtn;
    @FXML
    private Label pathLoc;
    @FXML
    private TextArea findInput;
    @FXML
    private TextArea replaceInput;
    @FXML
    private CheckBox moreDetails;
    @FXML
    private GridPane gridPane;

    private String path;

    /**
     * Initials the page
     */
    public void initialize() {
        runAppBtn.setDisable(true);
        progressBar.setVisible(false);

    }

    /**
     *runs when the run button is click in the app<br>
     *     it will get all the inputs form the fxml<br>
     *     it will create an object of the class FindAndReplace and runs it<br>
     *     at last it will print the result
     */
    @FXML
    public void runFindReplace() {
        progressBar.setVisible(true);
        String delimiter = findInput.getText();
        String replacement = replaceInput.getText();
        Boolean details = moreDetails.isSelected();
        ArrayList<String> filters = new ArrayList<>();
        filters.add("java");
        filters.add("html");
        filters.add("css");
        filters.add("js");
        filters.add("md");
        filters.add("sql");
        filters.add("txt");

        new Thread(() -> {
        FindAndReplace findReplace = new FindAndReplace(delimiter, replacement, path, filters, details);
        String report = findReplace.run();
        detailsResult.setText(report);
        progressBar.setVisible(false);
        }).start();


    }

    /**
     * this method run when the select button is click and it will get the path to the parent directory
     */
    @FXML
    public void getPath(){
        Path loadPath;
        DirectoryChooser chooser = new DirectoryChooser();
        chooser.setTitle("Parent Directory");
        File file = chooser.showDialog(gridPane.getScene().getWindow());
        if (file != null) {
        path = file.getAbsolutePath();
        } else {
            System.out.println("Chooser was cancelled");
        }
        pathLoc.setText(path);
        runAppBtn.setDisable(false);
    }
}
