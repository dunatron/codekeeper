<?php
use SilverStripe\FullTextSearch\Solr\SolrIndex;

class CodeKeeperSearchIndex extends SolrIndex {
    function init()
    {
        //https://github.com/silverstripe/silverstripe-fulltextsearch/blob/master/docs/en/Solr.md
        $this->addAllFulltextFields();
    }
}