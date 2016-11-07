<?php

namespace App\Repositories\VK\Animals;

use App\Models\VK\Animals\AnimalsLevel;
use App\Repositories\BaseRepository;

class AnimalsLevelRepository extends BaseRepository
{

    protected $group = 'vk_animals_other';

    private function getCache()
    {
        return $this->getCacheTags($this->group, 'levels');
    }

    private function getCacheById()
    {
        return $this->getCacheTags($this->group, 'id');
    }

    public function get()
    {
        if (!$this->getCache()->has('levels'))
        {
            if ($levels = (new AnimalsLevel())->getLevels()){
                $this->getCache()->forever('levels', $levels);
                return $levels;
            }
            return false;
        }
        return $this->getCache()->get('levels');
    }

    public function getByLevel($id){
        if (!$this->getCacheById()->has($id)){
            if ($level = (new AnimalsLevel())->getLevelById($id)){
                $this->getCacheById()->forever($id, $level);
                return $level;
            }
            return false;
        }
        return $this->getCacheById()->get($id);
    }

}