<?php
/**
 * Created by PhpStorm.
 * User: Praneeth Nidarshan
 * Date: 10/24/2016
 * Time: 12:15 PM
 */
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if($_GET['get_details']) {
    $detail = array();

    for($i = 1; $i <= 10; $i++) {
        $detail[] = array(
            'id'    => $i,
            'name'  => "Detail Row $i",
        );
    }

    echo json_encode($detail);
}