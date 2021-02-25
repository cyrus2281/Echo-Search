package com.ecocyrus.ecosearch;

import java.io.*;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.Scanner;
import java.util.regex.Pattern;
import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;

/**
 * This utility class will crawl recursively through the given path and will find all the files<br>
 * filter the paths based on the given file types<br>
 * scan through them, replace the search content with the given replacement content, finally write it to the file.
 *<br>
 * method <i>run()</i> will run the whole program<br>
 * other method of the program can be used alone statically<br>
 * The class can hold value to only one parent at a time
 * @author Milad Mobini
 * @version 1.1 February 25, 2021
 * @see PrintFileNames
 */
public class FindAndReplace {
    /**
     * The variable that holds all the paths to the files that the applications will go through
     */
    private static String allPaths = "";
    /**
     * The variable that holds the content that the program will search for in the files
     */
    private String delimiter;
    /**
     * The variable that holds the content that the program will replace
     */
    private String replacment;
    /**
     * The variable that holds the address of the parent folder where the search begins
     */
    private String folderPath;
    /**
     * The variable that holds all the file types to be searched
     */
    private ArrayList<String> filters;

    /**
     * Creats an object will all requirements for the run method
     * @param delimiter     the string that the program will look for
     * @param replacment    the replacement for the found string
     * @param folderPath    the parent folder path where the crawl starts
     * @param filters      the file type to look for
     */
    public FindAndReplace(String delimiter, String replacment, String folderPath, ArrayList<String> filters) {
        this.delimiter = delimiter;
        this.replacment = replacment;
        this.folderPath = folderPath;
        this.filters = filters;
    }
    /*
        this.delimiter = readFile("D:\\Leon\\Programing\\Projects\\Eco-Search\\Eco-Search\\src\\com\\ecocyrus\\ecosearch\\del.txt");
        this.replacment = readFile("D:\\Leon\\Programing\\Projects\\Eco-Search\\Eco-Search\\src\\com\\ecocyrus\\ecosearch\\rep.txt");
        this.folderPath = "D:\\Leon\\Programing\\Projects\\Eco-Search";
    */

    /**
     * This method will run the program and read, find, replace, write to the all files
     *
     * @return a report of all finds and changes
     */
    public String run() {

        ArrayList<String> allPaths = filteredTree(getTree(folderPath), filters);
        for (int index = 0; index < allPaths.size(); index++) {
            System.out.println("\n\n\n\npaths:\n" + allPaths.get(index));

            String fileContent = readFile(allPaths.get(index));
            System.out.println("\nold content:\n" + fileContent + "\n\n\n\nnew content:\n");
            fileContent = replaceFile(fileContent, Pattern.quote(delimiter), replacment);
            System.out.println(fileContent);

            writeFile(allPaths.get(index), fileContent);
        }
        return null;
    }

    /**
     * Reads any text file from the given path and return the output
     *
     * @param path path to the file
     * @return      contents of the file in a string output
     */
    public static String readFile(String path) {
        String content = "";
        try (Scanner scanner = new Scanner(new BufferedReader(new FileReader(path)));) {
            while (scanner.hasNextLine()) {
                content += scanner.nextLine() + "\n";
            }
        } catch (IOException e) {
            System.out.println(e.getMessage());
        } finally {
            return content;
        }
    }

    /**
     * Look for the given search string in the content string and will replace it with the replacement string.
     * @param content       the string to be looked at
     * @param delimiter     the string to be replaced
     * @param replace       the replacement string
     * @return              new replaced string
     */
    public static String replaceFile(String content, String delimiter, String replace) {
        content = content.replaceAll(delimiter, replace);
        return content;
    }

    /**
     * Gets a file path and will write the give string into it
     * @param path      path to the file
     * @param content   content to be written in the file
     */
    public static void writeFile(String path, String content) {
        try (FileWriter file = new FileWriter(path)) {
            file.write(content);
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }

    /**
     * This method will get parent folder, and it will crawl into it and returns all the paths
     * @param pathFolder    parent folder
     * @return              an string array holding all the sub-directories and -file
     */
    public static String[] getTree(String pathFolder) {
        Path directory = Paths.get(pathFolder);
        try {
            PrintFileNames crawler = new PrintFileNames();
            Files.walkFileTree(directory, crawler);
        } catch (IOException e) {
        }
        System.out.println("\n\n\n\n\n");

        String[] paths = allPaths.split("\n");
        System.out.println("Total Number of Paths Found: " + paths.length);
        return paths;
    }

    /**
     * This method will get a string array of paths of filter them based on the given types
     * @param paths     string array of all paths
     * @param filters   ArrayList of all the format to filter for
     * @return          an ArrayList of the filtered paths
     */
    public static ArrayList<String> filteredTree(String[] paths, ArrayList<String> filters) {
        ArrayList<String> allfiles = new ArrayList<String>();
        for (int count = 0; count < paths.length; count++) {
            if (paths[count].matches(makeFilter(filters))) {
                System.out.println(paths[count]);
                allfiles.add(paths[count]);
            }
        }
        return allfiles;
    }

    /**
     * This method will turn an array of file types (such as "java") into a regualr experssion
     * @param filters   an ArrayList of all types
     * @return          the regex for the types
     */
    private static String makeFilter(ArrayList<String> filters) {
        String allFilters = ".*\\.";
        for (int index = 0; index < filters.size(); index++) {
            allFilters += "(" + filters.get(index) + ")*";
        }
        return allFilters;
    }


    /**
     * This class inner extends <i>SimpleFileVisitor</i> which provides objects for <i>walkFileTree</i>.<br>
     * The class marks the visit files, and directories and add all paths to the outer class variable <i>allPaths</i>
     *
     * @author Milad Mobini
     * @author Tim Buchalka
     * @see FindAndReplace
     */
    public static class PrintFileNames extends SimpleFileVisitor<Path> {

        @Override
        public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
            FindAndReplace.allPaths += file.toAbsolutePath() + "\n";
            return FileVisitResult.CONTINUE;
        }

        @Override
        public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes bfa) throws IOException {
            return FileVisitResult.CONTINUE;
        }

        @Override
        public FileVisitResult visitFileFailed(Path t, IOException ioe) throws IOException {
            System.out.println("Error accessing file: " + t.toAbsolutePath() + " " + ioe.getMessage());
            return FileVisitResult.CONTINUE;
        }

        @Override
        public FileVisitResult postVisitDirectory(Path t, IOException ioe) throws IOException {
            return super.postVisitDirectory(t, ioe); //To change body of generated methods, choose Tools | Templates.
        }

    }

}
