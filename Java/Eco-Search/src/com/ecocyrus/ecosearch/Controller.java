package com.ecocyrus.ecosearch;

import com.ecocyrus.ecosearch.FindAndReplace.FindAndReplace;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.layout.GridPane;
import javafx.stage.DirectoryChooser;
import javafx.scene.control.Button;

import java.awt.*;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Path;
import java.util.ArrayList;

/**
 * Controller class for the fxml file
 *
 * @author Cyrus Mobini
 * @version 2.4.0.3 May 2021
 * https://github.com/cyrus2281
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
    private Button pathInput;
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
    @FXML
    private CheckBox txt;
    @FXML
    private CheckBox php;
    @FXML
    private CheckBox js;
    @FXML
    private CheckBox html;
    @FXML
    private CheckBox css;
    @FXML
    private CheckBox java;
    @FXML
    private CheckBox python;
    @FXML
    private CheckBox fxml;
    @FXML
    private CheckBox ino;
    @FXML
    private CheckBox sql;
    @FXML
    private CheckBox bash;
    @FXML
    private CheckBox cs;
    @FXML
    private TextField others;

    private String path;

    /**
     * Initials the page
     */
    public void initialize() {
        runAppBtn.setDisable(true);
        progressBar.setVisible(false);
    }

    /**
     * runs when the run button is click in the app<br>
     * it will get all the inputs form the fxml<br>
     * it will create an object of the class FindAndReplace and runs it<br>
     * at last it will print the result
     */
    @FXML
    public void runFindReplace() {
        progressBar.setVisible(true);
        String delimiter = findInput.getText();
        String replacement = replaceInput.getText();
        Boolean details = moreDetails.isSelected();
        setAllDisable(true);
        new Thread(() -> {
            ArrayList<String> filters = new ArrayList<>();
            filters = getTypes(filters);
            String report = "";
            try{
                FindAndReplace findReplace = new FindAndReplace(delimiter, replacement, path, filters, details);
                report = findReplace.run();
            } catch (IOException e){
                System.out.println("eooooor");
                report = "Process was not completed, an error occured\n" + e.getMessage();
            }finally {
                detailsResult.setText(report);
                setAllDisable(false);
                progressBar.setVisible(false);
            }
        }).start();
    }

    /**
     * change the disability of all inputs
     *
     * @param disable true for disable, and false for not disable
     */
    private void setAllDisable(boolean disable) {
        pathInput.setDisable(disable);
        txt.setDisable(disable);
        php.setDisable(disable);
        js.setDisable(disable);
        html.setDisable(disable);
        css.setDisable(disable);
        java.setDisable(disable);
        python.setDisable(disable);
        fxml.setDisable(disable);
        ino.setDisable(disable);
        sql.setDisable(disable);
        bash.setDisable(disable);
        cs.setDisable(disable);
        others.setDisable(disable);
        moreDetails.setDisable(disable);
        replaceInput.setDisable(disable);
        findInput.setDisable(disable);
    }

    /**
     * Get all the file types form the GUI and adds them to the filter list
     *
     * @param types filter list
     * @return filter list with added types
     */
    private ArrayList<String> getTypes(ArrayList<String> types) {
        if (txt.isSelected()) types.add("txt");
        if (php.isSelected())types.add("php");
        if (js.isSelected()) types.add("js");
        if (html.isSelected()) types.add("html");
        if (css.isSelected()) types.add("css");
        if (java.isSelected()) types.add("java");
        if (python.isSelected()) types.add("py");
        if (fxml.isSelected()) types.add("fxml");
        if (ino.isSelected()) types.add("ino");
        if (sql.isSelected()) types.add("sql");
        if (bash.isSelected()) types.add("sh");
        if (cs.isSelected()) types.add("cs");
        String otherTypes = others.getText();
        if (otherTypes.trim() != "" && otherTypes!= null){
            String[] allTypes = otherTypes.split(",");
            for (int index = 0; index < allTypes.length; index++) {
                types.add(allTypes[index].trim());
            }
        }
        return types;
    }

    /**
     * this method run when the select button is click and it will get the path to the parent directory
     */
    @FXML
    public void getPath() {
        Path loadPath;
        DirectoryChooser chooser = new DirectoryChooser();
        chooser.setTitle("Parent Directory");
        File file = chooser.showDialog(gridPane.getScene().getWindow());
        if (file != null) {
            path = file.getAbsolutePath();
            pathLoc.setText(path);
            runAppBtn.setDisable(false);
        } else {
            System.out.println("Chooser was cancelled");
        }
    }
    /**
     * Open the Cyrus Mobini's GitHub page in the default browser
     */
    @FXML
    public void handleLinkGithub() {
        try {
            Desktop.getDesktop().browse(new URI("https://github.com/cyrus2281/Eco-Search"));
        } catch (IOException | URISyntaxException e) {
            System.out.println(e.getMessage());
        }
    }
    /**
     * Open the ecocyrus.com in the default browser
     */
    @FXML
    public void handleLinkCyrus() {
        try {
            Desktop.getDesktop().browse(new URI("https://www.ecocyrus.com/"));
        } catch (IOException | URISyntaxException e) {
            System.out.println(e.getMessage());
        }
    }
}
