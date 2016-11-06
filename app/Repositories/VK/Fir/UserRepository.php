<?php

namespace App\Repositories\VK\Fir;

use App\Models\VK\Fir\FirUsers;
use App\Repositories\BaseUserRepository;

class UserRepository extends BaseUserRepository {

    protected $group = 'vk_users_fir';

    private function getCacheById(){
        return $this->getCacheTags($this->group, 'id');
    }

    public function isById($id){
        return $this->getCacheById()->has($id);
    }

    public function getById($id){
        return $this->addById($id);
    }

    public function getByIds(array $ids){
        return $this->addByIds($ids);
    }

    public function addById($id){
        if(!$this->isById($id)){
            if($user = (new FirUsers())->getUser($id)){
                $this->getCacheById()->forever($id, $user);
                return $user;
            }
            return false;
        }
        return $this->getCacheById()->get($id);
    }

    public function addByIds(array $ids){
        $notIds = [];
        $users = [];
        foreach ($ids as $id){
            if ($this->isById($id)){
                $users[] = $this->getCacheById()->get($id);
            }else{
                $notIds[] = $id;
            }
        }
        if(($count = count($notIds)) > 0){
            foreach ((new FirUsers())->getUsersIds($notIds, 0, $count) as $user){
                $this->getCacheById()->forever($user->vk_id, $user);
                $users[] = $user;
            }
        }
        return $users;
    }

    public function removeById($id){
        if($this->isById($id)){
            $this->getCacheById()->forget($id);
        }
    }

}