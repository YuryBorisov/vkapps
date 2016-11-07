<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', ['as' => 'home', 'uses' => 'Controller@home']);

Route::group(['prefix' => 'vk'], function(){
    Route::group(['prefix' => 'fir'], function(){
        Route::get('app', ['as' => 'vk.fir.app', 'uses' => 'VK\Fir\FirController@app']);
        Route::post('rating', ['as' => 'vk.fir.rating', 'uses' => 'VK\Fir\FirController@rating']);
        Route::post('add', ['as' => 'vk.fir.add', 'uses' => 'VK\Fir\FirController@addFir']);
        Route::get('generate', ['as' => 'vk.fir.generate', 'uses' => 'VK\Fir\FirController@generate']);
    });
    Route::group(['prefix' => 'animals'], function(){
        Route::get('app', ['as' => 'vk.animals.app', 'uses' => 'VK\Animals\AnimalsController@app']);
        Route::post('inc', ['as' => 'vk.animals.inc', 'uses' => 'VK\Animals\AnimalsController@inc']);
        Route::post('get', ['as'=> 'vk.animals.get', 'uses' => 'VK\Animals\AnimalsController@get']);
        Route::post('animals', ['as' => 'vk.animals.animals', 'uses' => 'VK\Animals\AnimalsController@animals']);
        Route::post('rating', ['as' => 'vk.animals.rating', 'uses' => 'VK\Animals\AnimalsController@rating']);
        Route::get('generate', ['as' => 'vk.animals.generate', 'uses' => 'VK\Animals\AnimalsController@generate']);
        Route::group(['prefix' => 'arcade'], function (){
            Route::post('user', ['as' => 'vk.animals.arcade.user', 'uses' => 'VK\Animals\AnimalsController@arcadeGetLevelUser']);
            Route::post('level', ['as' => 'vk.animals.arcade.level', 'uses' => 'VK\Animals\AnimalsController@arcadeGetLevel']);
            Route::post('levels', ['as' => 'vk.animals.arcade.levels', 'uses' => 'VK\Animals\AnimalsController@arcadeGetLevels']);
        });
    });
});