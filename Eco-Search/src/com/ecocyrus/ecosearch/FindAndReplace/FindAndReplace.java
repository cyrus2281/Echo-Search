package com.ecocyrus.ecosearch.FindAndReplace;

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
 * <br>
 * method <i>run()</i> will run the whole program<br>
 * other method of the program can be used alone statically<br>
 *
 * @author Milad Mobini
 * @version 2.4.0.3 May 2021
 * @see PrintFileNames
 * @see SimpleFileVisitor
 * https://github.com/milad2281
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
     * if true, the report result will also contain the old and new contents
     */
    private boolean moreDetails;

    /**
     * Creates an object will all requirements for the run method
     *
     * @param delimiter   the string that the program will look for
     * @param replacment  the replacement for the found string
     * @param folderPath  the parent folder path where the crawl starts
     * @param filters     the file type to look for
     * @param moreDetails if true, returns content of the files in result too
     */
    public FindAndReplace(String delimiter, String replacment, String folderPath, ArrayList<String> filters, boolean moreDetails) {
        this.delimiter = delimiter;
        this.replacment = replacment;
        this.folderPath = folderPath;
        this.filters = filters;
        this.moreDetails = moreDetails;
    }

    /**
     * get the string that the program will look for
     *
     * @return the string that the program will look for
     */
    public String getDelimiter() {
        return delimiter;
    }

    /**
     * set the string that the program will look for
     *
     * @param delimiter the string that the program will look for
     */
    public void setDelimiter(String delimiter) {
        this.delimiter = delimiter;
    }

    /**
     * get the replacement for the found string
     *
     * @return the replacement for the found string
     */
    public String getReplacment() {
        return replacment;
    }

    /**
     * set the replacement for the found string
     *
     * @param replacment the replacement for the found string
     */
    public void setReplacment(String replacment) {
        this.replacment = replacment;
    }

    /**
     * get the parent folder path where the crawl starts
     *
     * @return the parent folder path where the crawl starts
     */
    public String getFolderPath() {
        return folderPath;
    }

    /**
     * set the parent folder path where the crawl starts
     *
     * @param folderPath the parent folder path where the crawl starts
     */
    public void setFolderPath(String folderPath) {
        this.folderPath = folderPath;
    }

    /**
     * get the file type to look for
     *
     * @return the file type to look for
     */
    public ArrayList<String> getFilters() {
        return filters;
    }

    /**
     * set the file type to look for
     *
     * @param filters the file type to look for
     */
    public void setFilters(ArrayList<String> filters) {
        this.filters = filters;
    }

    /**
     * get whether returns content of the files in result too
     *
     * @return whether returns content of the files in result too
     */
    public boolean isMoreDetails() {
        return moreDetails;
    }

    /**
     * set whether returns content of the files in result too
     *
     * @param moreDetails if true, returns content of the files in result too
     */
    public void setMoreDetails(boolean moreDetails) {
        this.moreDetails = moreDetails;
    }

    /**
     * This method will run the program and read, find, replace, write to the all files<br>
     * and return a report of the program
     *
     * @return a report of all finds and changes
     * @throws IOException if an I/O error occurs
     */
    public String run() throws IOException {
        //This string will hold a report of the run result
        StringBuilder result = new StringBuilder();
        ArrayList<String> allPaths = filteredTree(getTree(folderPath), filters);
        result.append("total matched files: ").append(allPaths.size()).append("\n\n");
        for (int index = 0; index < allPaths.size(); index++) {
            result.append("Path ").append(index + 1).append(":  ").append(allPaths.get(index)).append("\n");
            String fileContent = readFile(allPaths.get(index));
            if (moreDetails) {
                result.append("########## old content: ##########\n\n").append(fileContent).append("\n\n########## new content: ##########\n\n");
            }
            fileContent = replaceFile(fileContent, Pattern.quote(delimiter), replacment);
            if (moreDetails) {
                result.append(fileContent);
            }
            writeFile(allPaths.get(index), fileContent);
            result.append("\n*************************\n");
        }
        return result.toString();
    }

    /**
     * Reads any text file from the given path and return the output deviding each lien by '\n'
     *
     * @param path path to the file
     * @return contents of the file in a string output
     */
    public static String readFile(String path) {
        return readFile(path, "\n");
    }

    /**
     * /**
     * Reads any text file from the given path and return the output dividing each lien by '\n'
     *
     * @param path          path to the file
     * @param lineDelimiter seperate each line of input file with this delimiter (Default: '\n')
     * @return contents of the file in a string output
     */
    public static String readFile(String path, String lineDelimiter) {
        StringBuilder content = new StringBuilder();
        try (Scanner scanner = new Scanner(new BufferedReader(new FileReader(path)))) {
            while (scanner.hasNextLine()) {
                content.append(scanner.nextLine()).append(lineDelimiter);
            }
        } finally {
            return content.toString();
        }
    }

    /**
     * Look for the given search string in the content string and will replace it with the replacement string.
     *
     * @param content   the string to be looked at
     * @param delimiter the string to be replaced
     * @param replace   the replacement string
     * @return new replaced string
     */
    public static String replaceFile(String content, String delimiter, String replace) {
        content = content.replaceAll(delimiter, replace);
        return content;
    }

    /**
     * Gets a file path and will write the give string into it
     *
     * @param path    path to the file
     * @param content content to be written in the file
     * @throws IOException if an I/O error occurs
     */
    public static void writeFile(String path, String content) throws IOException {
        try (FileWriter file = new FileWriter(path)) {
            file.write(content);
        }
    }

    /**
     * This method will get parent folder, and it will crawl into it and returns all the paths
     *
     * @param pathFolder parent folder
     * @return an string array holding all the sub-directories and -file
     * @throws IOException if an I/O error is thrown by a visitor method
     */
    public static String[] getTree(String pathFolder) throws IOException {
        Path directory = Paths.get(pathFolder);
        allPaths = "";
        PrintFileNames crawler = new PrintFileNames();
        Files.walkFileTree(directory, crawler);
        String[] paths = allPaths.split("\n");
        allPaths = "";
        return paths;
    }

    /**
     * This method will get a string array of paths of filter them based on the given types
     *
     * @param paths   string array of all paths
     * @param filters ArrayList of all the format to filter for
     * @return an ArrayList of the filtered paths
     */
    public static ArrayList<String> filteredTree(String[] paths, ArrayList<String> filters) {
        ArrayList<String> allfiles = new ArrayList<>();
        for (String path : paths) {
            if (path.matches(makeFilter(filters))) {
                allfiles.add(path);
            }
        }
        return allfiles;
    }

    /**
     * This method will turn an array of file types (such as "java") into a regualr experssion
     *
     * @param filters an ArrayList of all types
     * @return the regex for the types
     */
    private static String makeFilter(ArrayList<String> filters) {
        StringBuilder allFilters = new StringBuilder(".*\\.");
        for (String filter : filters) {
            allFilters.append("(").append(filter).append(")*");
        }
        return allFilters.toString();
    }


    /**
     * This class inner extends <i>SimpleFileVisitor</i> which provides objects for <i>walkFileTree</i>.<br>
     * The class marks the visit files, and directories and add all paths to the outer class variable <i>allPaths</i>
     *
     * @author Milad Mobini
     * @author Tim Buchalka
     * @see FindAndReplace
     * @see SimpleFileVisitor
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
