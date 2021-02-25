package com.ecocyrus.ecosearch;

import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;

import java.io.File;
import java.util.ArrayList;

public class Controller {
    /**
     * Holder for logo
     */
    @FXML
    private ImageView imageView;
    @FXML
    private ProgressBar progressBar;
    @FXML
    private TextArea detailsResult;
    @FXML
    private Button runAppBtn;
    @FXML
    private Button pathInput;
    @FXML
    private Label pathLoc;
    @FXML
    private TextField findInput;
    @FXML
    private TextField replaceInput;
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
    public void runFindReplace() {
        progressBar.setVisible(true);

        String delimiter = findInput.getText();
        String replacement = replaceInput.getText();
        ArrayList<String> filters = new ArrayList<>();
//        filters.add("java");
        filters.add("txt");

        FindAndReplace findReplace = new FindAndReplace(delimiter, replacement, path, filters);
        findReplace.run();

        progressBar.setVisible(false);
    }

}
