<?php

namespace App\Http\Controllers\VK\Animals;

use App\Models\VK\Animals\AnimalsUsers;
use App\Models\VK\Animals\CaughtAnimalsUser;
use App\Repositories\VK\Animals\AnimalsLevelRepository;
use App\Repositories\VK\Animals\AnimalsTypeRepository;
use App\Repositories\VK\Animals\UserRepository;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class AnimalsController extends Controller
{

    protected $response = ['response' => ['status' => 'error']];

    const RATING_COUNT = 14;

    const DEFAULT_LEVEL = 1;

    const PARAM_GET = ['count_animals', 'level'];

    public function app(Request $request)
    {
        $vkId = $request->input('viewer_id');
        if($user = UserRepository::instance()->getById($vkId)){
            $data = ['level' => $user->level, 'count_animals' => $user->count_animals];
        }else{
            (new AnimalsUsers())->add(['vk_id' => $vkId, 'create' => date('Y-m-d H:i:s')]);
            $data = ['level' => self::DEFAULT_LEVEL, 'count_animals' => 0];
        }
        return view('VK/Animals/animals', ['data' => $data]);
    }

    public function animals(){
        if($data = AnimalsTypeRepository::instance()->get())
        {
            $this->response['response']['status'] = 'success';
            $this->response['response']['data'] = $data;
        }else{
            $this->response['response']['message'] = 'Попробуйте позже';
        }
        return $this->response;
    }

    public function inc(Request $request)
    {
        if($request->has('arcade') && $request->has('count_animals') && $request->has('vk_id')){
            $data = $request->all();
            if(is_numeric($data['count_animals']) && is_numeric($data['vk_id'])){
                if($user = ($rep = UserRepository::instance())->getById($data['vk_id'])){
                    $arr = array_fill(0, $data['count_animals'], ['vk_id' => $data['vk_id'], 'create' => date('Y-m-d H:i:s')]);
                    $cau = new CaughtAnimalsUser();
                    if((bool)$data['arcade']){
                        DB::beginTransaction();
                        try{
                            ($model = (new AnimalsUsers()))->incrementCountAnimals($data['vk_id'], $data['count_animals']);
                            $model->incrementLevel($data['vk_id']);
                            $cau->add($arr);
                            $this->response['response']['status'] = 'success';
                            $this->response['response']['data'] = [
                                'level' => ++$user->level,
                                'count_animals' => $user->count_animals + $data['count_animals']
                            ];
                            DB::commit();
                        }catch (QueryException $e){
                            Log::error(__LINE__ .' строка в ' .__CLASS__. ' ошибка ' . $e->getMessage());
                            $this->response['response']['message'] = 'Попробуйте позже';
                            DB::rollback();
                        }
                    }else{
                        try{
                            $cau->add($arr);
                            (new AnimalsUsers())->incrementCountAnimals($data['vk_id'], $data['count_animals']);
                            $this->response['response']['status'] = 'success';
                            $this->response['response']['data'] = [
                                'level' => $user->level,
                                'count_animals' => $user->count_animals + $data['count_animals']
                            ];
                            DB::commit();
                        }catch (QueryException $e){
                            Log::error(__LINE__ .' строка в ' .__CLASS__. ' ошибка ' . $e->getMessage());
                            $this->response['response']['message'] = 'Попробуйте позже';
                        }
                    }
                    $rep->removeById($data['vk_id']);
                }else{
                    $this->response['response']['message'] = 'Пользователя с таким id не существует';
                }
            }else{
                $this->response['response']['message'] = 'count_animals и vk_id должны иметь тип integer';
            }
        }else{
            $this->response['response']['message'] = 'Не все данные в запросе';
        }
        return $this->response;
    }

    public function get(Request $request)
    {
        if($request->has('vk_id')){
            $data = $request->all();
            if($user = UserRepository::instance()->getById($data['vk_id'])){
                $this->response['response']['status'] = 'success';
                $this->response['response']['data'] = [
                    'count_animals' => $user->count_animals,
                    'level' => $user->level
                ];
            }else{
                $this->response['response']['message'] = 'Такой пользователь не существует';
            }
        }else{
            $this->response['response']['message'] = 'Не все данные в запросе';
        }
        return $this->response;
    }

    public function arcadeGetLevel(Request $request)
    {
        if($request->has('level_id')){
            if($level = AnimalsLevelRepository::instance()->getByLevel($request->input('level_id'))){
                $this->response['response']['status'] = 'success';
                $this->response['response']['data'] = $level;
            }else{
                $this->response['response']['message'] = 'Попробуйте позже';
            }
        }else{
            $this->response['response']['message'] = 'Такого уровня не существует';
        }
        return $this->response;
    }

    public function arcadeGetLevels()
    {
        if($levels = AnimalsLevelRepository::instance()->get()){
            $this->response['response']['status'] = 'success';
            $this->response['response']['data']['levels'] = $levels;
        }else{
            $this->response['response']['message'] = 'Попробуйте позже';
        }
        return $this->response;
    }

    public function arcadeGetLevelUser(Request $request)
    {
        if($request->has('vk_id')){
            if($user = UserRepository::instance()->getById($request->input('vk_id'))){
                if($level = AnimalsLevelRepository::instance()->getByLevel($user->level)){
                    $this->response['response']['status'] = 'success';
                    $this->response['response']['data']['level'] = $level;
                }else{
                    $this->response['response']['message'] = 'Попробуйте позже';
                }
            }else{
                $this->response['response']['message'] = 'Такого пользователя не существует';
            }
        }else{
            $this->response['response']['message'] = 'Не все данные в запросе';
        }
        return $this->response;
    }

    public function rating(Request $request)
    {
        if($request->has('type')){
            $result['users'] = false;
            $data = $request->all();
            if(!$request->has('page') && !is_numeric($data['page']) && $data['page'] <= 0){
                $data['page'] = 1;
            }
            $skip = ($data['page'] - 1) * self::RATING_COUNT;
            switch($data['type']){
                case 'today':
                    $result['users'] = (new CaughtAnimalsUser())->getCountUsersFirByDate(date('Y-m-d'), $skip, self::RATING_COUNT + 1);
                    break;
                case 'all':
                    $result['users'] = (new AnimalsUsers())->getUsers($skip, self::RATING_COUNT + 1, 'desc', ['vk_id', 'count_animals']);
                    break;
                case 'friends':
                    if(isset($data['vk_ids']) && is_array($data['vk_ids'])){
                        $ids = [];
                        foreach ($data['vk_ids'] as $id){
                            if(is_numeric($id)){
                                $ids[] = $id;
                            }
                        }
                        $result['users'] = (new AnimalsUsers())->getUsersIds(
                            $ids,
                            $skip,
                            ($count = count($ids)) > self::RATING_COUNT + 1 ? self::RATING_COUNT + 1 : $count, 'desc',
                            ['vk_id', 'count_animals']
                        );
                    }
            }
            if($result['users']) {
                $result['page'] = $data['page'];
                if ($result['users']->count() > self::RATING_COUNT) {
                    $result['users']->pop();
                    $result['next'] = true;
                } else {
                    $result['next'] = false;
                }
                $this->response['response']['status'] = 'success';
                $this->response['response']['data'] = $result;
                $this->response['response']['data']['date'] = date('Y-m-d');
            }else{
                $this->response['response']['message'] = 'Такой тип рейтинга не существует';
            }
        }else{
            $this->response['response']['message'] = 'Не все данные в запросе';
        }
        return $this->response;
    }

    public function generate()
    {
        $vkIds = [
            '36765', '12676639', '16622006', '17157431',
            '22697595', '32070524', '36053375', '72969633',
            '83849627', '121780335', '123730550', '142899669',
            '250362666', '44730280', '127336130', '132139818',
            '145282998', '68883739', '260307236', '212933906',
            '195953475', '60811221', '6230628', '9534786',
            '14078140', '8493200', '165338142', '182729303',
            '223680140', '370908450', '380950053', '55180025',
            '89372728', '92409824', '154204487', '152470922'
        ];
        $animalsUserMode = new AnimalsUsers();
        $caughtAnimalsUserModel = new CaughtAnimalsUser();
        DB::beginTransaction();
        try{
            foreach ($vkIds as $id){
                $rand = rand(1, 22);
                $arr = [];
                $date = date('Y:m:d H:i:s');
                for ($i = 0; $i < $rand; $i++){
                    $arr[] = [
                        'vk_id' => $id,
                        'create' => $date
                    ];
                }
                $animalsUserMode->add([
                    'vk_id' => $id,
                    'count_animals' => $rand,
                    'create' => $date
                ]);
                $caughtAnimalsUserModel->add($arr);
            }
            DB::commit();
            echo 'End.';
        }catch (QueryException $e){
            DB::rollback();
            echo $e->getMessage();
        }
    }

}