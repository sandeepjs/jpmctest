/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2014 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */
"use strict";
use(["/libs/wcm/foundation/components/utils/ResourceUtils.js",
     "/libs/sightly/js/3rd-party/q.js"], function (ResourceUtils, Q){
    
    var Constants = {
            START_LEVEL_PROP: "absParent",
            DEFAULT_START_LEVEL: 2,
            RELATIVE_PARENT_PROP: "relParent",
            DEFAULT_RELATIVE_PARENT: 1,
            MIN_ITEMS_PROP: "minItems",
            DEFAULT_MIN_ITEMS: 1
    };
    
    log.debug("Collecting page breadcrumbs");
    
    var _collectBreadcrumbs = function(rootPage, startLevel, endLevel, currentLevel, container, collectDeferred) {
        if (!collectDeferred) {
            collectDeferred = Q.defer();
        }
        if (!container) {
            container = [];
        }
        
        if (currentLevel > endLevel) {
            log.debug("Found " + container.length + " total breadcrumbs!");
            collectDeferred.resolve(container);
            return;
        }
        
        log.debug("Processing breadcrumb " + currentLevel + " for page " + rootPage.path);
        var itemPath = ResourceUtils.getAbsoluteParent(rootPage.path, currentLevel);
        
        log.debug("Found breadcrumb path" + itemPath);
        
        var cssClass = "breadcrumb-item-" + currentLevel;
        if (currentLevel == startLevel) cssClass += " breadcrumb-first";
        if (currentLevel == endLevel - 1) cssClass += " breadcrumb-last";
        
        ResourceUtils.getResource(itemPath).then(function (currentItem) {
            log.debug("Resolved breadcrumb item resource " + currentItem.path);
            ResourceUtils.getPageProperties(currentItem).then(function (itemProperties) {
                log.debug("Resolved breadcrumb item properties for " + currentItem.path);
                var title = itemProperties["navTitle"];
                if (!title) {
                    title = itemProperties["jcr:title"];
                }
                if (!title) {
                    title = currentItem.name;
                }
                
                var shouldHide = itemProperties["hideInNav"] == "true"
                        || itemProperties["hideInNav"] == true;
                
                if (!shouldHide) {
                    log.debug("Adding breadcrumb: path " + currentItem.path 
                            + " cssClasses: " + cssClass
                            + " title: " + title);
                    
                    container.push({
                        path: currentItem.path + ".html",
                        cssClass: cssClass,
                        title: title
                    });
                }
                
                _collectBreadcrumbs(rootPage, startLevel, endLevel, currentLevel + 1, container, collectDeferred);
            });
        });
    };
    
    var startLevel = Constants.DEFAULT_START_LEVEL;
    var relativeParent = Constants.DEFAULT_RELATIVE_PARENT;
    var minItems = Constants.DEFAULT_MIN_ITEMS;
    
    if (currentStyle) {
        startLevel = parseInt(currentStyle.get(Constants.START_LEVEL_PROP, Constants.DEFAULT_START_LEVEL));
        relativeParent = parseInt(currentStyle.get(Constants.END_LEVEL_PROP, Constants.DEFAULT_RELATIVE_PARENT));
        minItems = parseInt(currentStyle.get(Constants.MIN_ITEMS_PROP, Constants.DEFAULT_MIN_ITEMS));
    }
    
    log.debug("Breadcrumbs component parameters: startLevel=" + startLevel
            + " relativeParent=" + relativeParent
            + " minItems=" + minItems);
    
    var crumbsDeferred = Q.defer();
    ResourceUtils.getContainingPage(granite.resource).then(function (containingPage) {
        var pageDepth = containingPage.path.match(/\//g).length;
        var endLevel = pageDepth - relativeParent;
        log.debug("Breadcrumbs pageDepth=" + pageDepth
                + " relative parent=" + relativeParent
                + " -> endLevel=" + endLevel);
        
        _collectBreadcrumbs(containingPage, startLevel, endLevel, startLevel, undefined, crumbsDeferred);
    }, function () {
        crumbsDeferred.resolve([]);
    });
    
    return {
        items: crumbsDeferred.promise
    };
});
