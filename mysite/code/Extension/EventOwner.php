<?php

namespace MyOrg\Extension;

use GraphQL\Type\Definition\ResolveInfo;
use MyOrg\Model\Vote;
use SilverStripe\GraphQL\Scaffolding\Interfaces\ScaffoldingProvider;
use SilverStripe\GraphQL\Scaffolding\Scaffolders\SchemaScaffolder;
use SilverStripe\ORM\DataExtension;
use SilverStripe\Security\Member;
use MyOrg\Model\Event;
use MyOrg\Model\Link;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\GridField\GridField;
use SilverStripe\Forms\GridField\GridFieldConfig_RelationEditor;

class EventOwner extends DataExtension implements ScaffoldingProvider
{

    private static $has_many = [
        'UsersVotes' => Vote::class,
    ];

    private static $many_many = [
        'Friends' => Member::class
    ];

    public function updateCMSFields(FieldList $fields)
    {

        $friendField = GridField::create('Friends')
            ->setList($this->owner->Friends())
            ->setConfig(GridFieldConfig_RelationEditor::create());
        $fields->addFieldToTab('Root.Friends', $friendField);
    }

    public function canCreate($member = null, $context = array())
    {
        return true;
    }

    public function provideGraphQLScaffolding(SchemaScaffolder $scaffolder)
    {
        $scaffolder
            ->query('login', __CLASS__)
            ->addArgs([
                'ID' => 'ID!'
            ])
            ->setResolver(function ($object, array $args, $context, ResolveInfo $info) {
                $user = self::get()->byID($args['ID']);
                if (!$user) {
                    throw new \InvalidArgumentException(sprintf(
                        'User #%s does not exist',
                        $args['ID']
                    ));
                }
                $params = [
                    'ID' => $user->ID,
                ];

                return $user;
            });

        return $scaffolder;
    }

}