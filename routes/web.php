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

Route::get('/', function () { return view('welcome'); });

Route::group(['prefix' => 'vk'], function(){
    Route::group(['prefix' => 'fir'], function(){
        Route::get('app', ['as' => 'vk.fir.app', 'uses' => 'VK\Fir\FirController@app']);
        Route::post('user', ['as' => 'vk.fir.user', 'uses' => 'VK\Fir\FirController@isUser']);
        Route::post('rating', ['as' => 'vk.fir.rating', 'uses' => 'VK\Fir\FirController@getRating']);
        Route::post('add', ['as' => 'vk.fir.add', 'uses' => 'VK\Fir\FirController@addFir']);
        Route::get('test', function(){
            dd((new App\Models\VK\Fir\Firs())->getCountUsersFirByDate(date('Y-m-d'), 0, 1000));
        });
        Route::get('generate', function (){
            $vkIds = [
                '36765', '12676639', '16622006', '17157431',
                '22697595', '32070524', '36053375', '72969633',
                '83849627', '121780335', '123730550', '142899669',
                '250362666'
            ];
            $firsModel = new App\Models\VK\Fir\Firs();
            $firsUserModel = new \App\Models\VK\Fir\FirUsers();
            \Illuminate\Support\Facades\DB::beginTransaction();
            try{
                foreach ($vkIds as $id){
                    $rand = rand(1, 22);
                    $arr = [];
                    for ($i = 0; $i < $rand; $i++){
                        $arr[] = [
                            'vk_id' => $id,
                            'create' => date('Y:m:d H:i:s')
                        ];
                    }
                    $firsUserModel->add([
                        'vk_id' => $id,
                        'count_firs' => $rand,
                        'create' => date('Y:m:d H:i:s')
                    ]);
                    $firsModel->add($arr);
                }
                \Illuminate\Support\Facades\DB::commit();
                echo 'End.';
            }catch (\Illuminate\Database\QueryException $e){
                \Illuminate\Support\Facades\DB::rollback();
                echo $e->getMessage();
            }
        });
    });
});

/*
 * Route::get('/vk/app', ['as' => 'vk.vk.home', 'uses' => 'VK\VKController@home']);

Route::post('/vk/app/user', ['as' => 'vk.vk.user', 'uses' => 'VK\Fir\FirController@isUser']);

Route::post('/vk/app/rating/today/{page?}', ['as' => 'vk.vk.rating.today', 'uses' => 'VK\VKController@getRatingToDay']);

Route::post('/vk/app/rating/all/{page?}', ['as' => 'vk.vk.rating.all', 'uses' => 'VK\VKController@getRatingAll']);

Route::post('/vk/app/rating/friends/', ['as' => 'vk.vk.rating.friends', 'uses' => 'VK\VKController@getRatingFriends']);

Route::post('/vk/app/addFirs', ['as' => 'vk.vk.add_firs', 'uses' => 'VK\VKController@addFirs']);

Route::post('/vk/app/firs', ['as' => 'vk.vk.firs', 'uses' => 'VK\VKController@getFirs']);
 */