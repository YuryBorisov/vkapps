<?php

namespace App\Repositories\VK\Animals;

use App\Models\VK\Animals\TypeAnimals;
use App\Repositories\BaseRepository;

class AnimalsTypeRepository extends BaseRepository {

    protected $group = 'vk_animals_other';

    private function getCache(){
        return $this->getCacheTags($this->group, 'types_animal');
    }

    public function get(){
        if(!$this->getCache()->has('types')){
            if($types = (new TypeAnimals())->getTypes(['*'])){
                $this->getCache()->forever('types', $types);
                return $types;
            }
            return false;
        }
        return $this->getCache()->get('types');
    }

}