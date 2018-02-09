<?php
namespace MyOrg\Controller;
use MyOrg\Model\CodeSample;
use SilverStripe\Admin\ModelAdmin;
class CodeSampleAdmin extends ModelAdmin
{
    private static $managed_models = [
        CodeSample::class,
    ];
    private static $url_segment = 'code-sample-admin';
    private static $menu_title = 'CodeSamples';
}