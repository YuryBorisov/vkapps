<?php

namespace App\Http\Controllers\VK\Fir;

use App\Models\VK\Fir\Firs;
use App\Models\VK\Fir\FirUsers;
use App\Repositories\Fir\UserRepository;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FirController extends Controller
{

    const RATING_COUNT_USERS = 7;

    public function app(){
        return view('VK/Fir/fir');
    }

    public function isUser(Request $request){
        $response['status'] = 'error';
        if($request->has('vk_id') && is_numeric($vkId = $request->input('vk_id'))){
            $response['status'] = 'success';
            if($user = UserRepository::instance()->getById($vkId)){
                $response['data'] = ['user' => 'not_new', 'count_firs' => $user->count_firs];
            }else{
                (new FirUsers())->add(['vk_id' => $vkId, 'create' => date('Y-m-d H:i:s')]);
                $response['data'] = ['user' => 'new', 'count_firs' => 0];
            }
        }
        return $response;
    }

    public function getRating(Request $request){
        $response['status'] = 'error';
        if($request->has('type') && $request->has('page')){
            $result['users'] = false;
            $data = $request->all();
            if(!is_numeric($data['page']) && $data['page'] <= 0){
                $data['page'] = 1;
            }
            $skip = ($data['page'] - 1) * self::RATING_COUNT_USERS;
            switch($data['type']){
                case 'today':
                    $result['users'] = (new Firs())->getCountUsersFirByDate(date('Y-m-d'), $skip, self::RATING_COUNT_USERS + 1);
                    break;
                case 'all':
                    $result['users'] = (new FirUsers())->getUsers($skip, self::RATING_COUNT_USERS + 1, 'desc', ['vk_id', 'count_firs']);
                    break;
                case 'friends':
                    if(isset($data['vk_ids']) && is_array($data['vk_ids'])){
                        $result['users'] = (new FirUsers())->getUsersIds($data['vk_ids'], $skip, self::RATING_COUNT_USERS + 1, 'desc', ['vk_id', 'count_firs']);
                    }
            }
            if($result['users']){
                $result['page'] = $data['page'];
                if($result['users']->count() > self::RATING_COUNT_USERS){
                    $result['users']->pop();
                    $result['next'] = true;
                }else{
                    $result['next'] = false;
                }
                $response['status'] = 'success';
                $response['data'] = $result;
            }else{
                $response['message'] = 'Такой тип рейтинга не существует';
            }
        }else{
            $response['message'] = 'В запросе отсутствует тип рейтинга и номер страница';
        }
        return $response;
    }

    public function addFir(Request $request){
        $response['status'] = 'error';
        if($request->has('vk_id')){
            if($user = ($userRepository = UserRepository::instance())->getById($vkId = $request->input('vk_id'))){
                DB::beginTransaction();
                try{
                    (new Firs())->add(['vk_id' => $vkId, 'create' => date('Y-m-d H:i:s')]);
                    (new FirUsers())->incrementCountFirs($vkId);
                    $userRepository->removeById($vkId);
                    $response['status'] = 'success';
                    $response['data']['count_firs'] = ++$user->count_firs;
                    DB::commit();
                }catch (QueryException $e){
                    DB::rollback();
                    Log::error(__LINE__.' строка в '.__CLASS__.' Ошибка: "'.$e->getMessage().'"');
                    $response['message'] = 'Попробуйте позже';
                }
            }else{
                $response['message'] = 'Пользователь с таким id не существует';
            }
        }else{
            $response['message'] = 'В запросе отсутствует vk_id';
        }
        return $response;
    }

}
