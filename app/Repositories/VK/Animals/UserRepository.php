<?php

namespace App\Repositories\VK\Animals;

use App\Models\VK\Animals\AnimalsUsers;
use App\Repositories\BaseUserRepository;

class UserRepository extends BaseUserRepository {

    protected $group = 'vk_users_animals';

    private function getCacheById()
    {
        return $this->getCacheTags($this->group, 'id');
    }

    public function isById($id)
    {
        return $this->getCacheById()->has($id);
    }

    public function getById($id)
    {
        return $this->addById($id);
    }

    public function getByIds(array $ids)
    {
        return $this->addByIds($ids);
    }

    public function addById($id)
    {
        if(!$this->isById($id)){
            if ($user = (new AnimalsUsers())->getUser($id, ['vk_id', 'count_animals', 'level']))
            {
                $this->getCacheById()->forever($id, $user);
                return $user;
            }
            return false;
        }
        return $this->getCacheById()->get($id);
    }

    public function addByIds(array $ids)
    {
        $ids = array_unique($ids);
        $IdsNotCache = $returnUsers = [];
        foreach ($ids as $id)
        {
            if ($this->getById($id))
            {
                if ($user = $this->getById($id))
                {
                    $returnUsers[] = $user;
                }
                continue;
            }
            $IdsNotCache[] = $id;
        }
        if (($count = count($IdsNotCache)) > 0)
        {
            foreach ((new AnimalsUsers())->getUsersIds($IdsNotCache, 0, $count, 'asc', ['vk_id', 'count_animals', 'level']) as $user)
            {
                $this->getCacheById()->forever($user->vk_id, $user);
                $returnUsers[] = $user;
            }
        }
        return $returnUsers;
    }

    public function removeById($id)
    {
        if ($this->isById($id))
        {
            $this->getCacheById()->forget($id);
        }
    }

}