<?php

namespace App\Http\Controllers\VK\Fir;

use App\Models\VK\Fir\Firs;
use App\Models\VK\Fir\FirUsers;
use App\Repositories\VK\Fir\UserRepository;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FirController extends Controller
{

    protected $response = ['response' => ['status' => 'error']];

    const RATING_COUNT_USERS = 7;

    public function app(Request $request)
    {
        if($request->has('viewer_id')){
            $vkId = $request->input('viewer_id');
            if($user = UserRepository::instance()->getById($vkId)){
                $data = ['user' => 'not', 'count_firs' => $user->count_firs];
            }else{
                (new FirUsers())->add(['vk_id' => $vkId, 'create' => date('Y-m-d H:i:s')]);
                $data = ['user' => 'new', 'count_firs' => 0];
            }
            return view('VK/Fir/fir', ['data' => $data]);
        }
        return 'Error';
    }

    public function rating(Request $request)
    {
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
                    $result['users'] = (new FirUsers())->getUsers($skip, self::RATING_COUNT_USERS + 1, 1, 'desc', ['vk_id', 'count_firs']);
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
                $this->response['status'] = 'success';
                $this->response['data'] = $result;
            }else{
                $this->response['message'] = 'Такой тип рейтинга не существует';
            }
        }else{
            $this->response['message'] = 'В запросе отсутствует тип рейтинга и номер страница';
        }
        return $this->response;
    }

    public function addFir(Request $request)
    {
        if($request->has('vk_id')){
            if($user = ($userRepository = UserRepository::instance())->getById($vkId = $request->input('vk_id'))){
                DB::beginTransaction();
                try{
                    (new Firs())->add(['vk_id' => $vkId, 'create' => date('Y-m-d H:i:s')]);
                    (new FirUsers())->incrementCountFirs($vkId);
                    $userRepository->removeById($vkId);
                    $this->response['status'] = 'success';
                    $this->response['data']['count_firs'] = ++$user->count_firs;
                    DB::commit();
                }catch (QueryException $e){
                    DB::rollback();
                    Log::error(__LINE__.' строка в '.__CLASS__.' Ошибка: "'.$e->getMessage().'"');
                    $this->response['message'] = 'Попробуйте позже';
                }
            }else{
                $this->response['message'] = 'Пользователь с таким id не существует';
            }
        }else{
            $this->response['message'] = 'В запросе отсутствует vk_id';
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
        $firsModel = new Firs();
        $firsUserModel = new FirUsers();
        DB::beginTransaction();
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
            DB::commit();
            echo 'End.';
        }catch (QueryException $e){
            DB::rollback();
            echo $e->getMessage();
        }
    }

}