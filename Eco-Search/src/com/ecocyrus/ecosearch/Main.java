package com.ecocyrus.ecosearch;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;
import javafx.scene.image.Image;

/**
 * Class Main that holds the method main which run the application
 * This application is a GUI replacement for the class FindAndReplace
 *
 * @author Milad Mobini
 * https://github.com/milad2281
 */
public class Main extends Application {
    /**
     * The method to start the JavaFx
     * @param primaryStage gets the current thread as the main scene
     * @throws Exception
     */
    @Override
    public void start(Stage primaryStage) throws Exception {
        Parent root = FXMLLoader.load(getClass().getResource("application.fxml"));
        primaryStage.setTitle("Eco-Search");
        primaryStage.getIcons().add(new Image("/com/ecocyrus/ecosearch/EcoCyrusLogo.png"));
        primaryStage.setScene(new Scene(root, 700, 800));
        primaryStage.show();
    }

    /**
     * Method main
     * @param args not implemented
     */
    public static void main(String[] args) {
        launch(args);
    }
}
