package com.jpmctest.core.models;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.PostConstruct;
import javax.inject.Inject;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;

@Model(adaptables=SlingHttpServletRequest.class)
public class Breadcrumb {

  private final Logger logger = LoggerFactory.getLogger(Breadcrumb.class);
  
  protected static final int PROP_START_LEVEL_DEFAULT = 2;
  protected static final String START_LEVEL_PROPERTY = "startLevel";
  protected static final String STOP_LEVEL_PROPERTY = "stopLevel";
  
  @Inject
  @Optional
  private int startLevel;
  
  @Inject
  @Optional
  private int stopLevel;
  
  @Inject
  @Optional
  private Style currentStyle;
  
  @Inject
  @Optional
  private Page currentPage;
  
  private List<Page> pageList;

  @PostConstruct
  protected void init() {
    startLevel = currentStyle.get(START_LEVEL_PROPERTY, PROP_START_LEVEL_DEFAULT);
    stopLevel = currentStyle.get(STOP_LEVEL_PROPERTY, 0);
  }

  public List<Page> getItems() {
    if (pageList == null) {
      logger.debug("Getting the list of pages to show on breadcrumb on page: {}", currentPage.getPath());
      pageList = createList();
    }
    return pageList;
  }
  
  private List<Page> createList() {
    List<Page> items = new ArrayList<Page>();
    int currentLevel = currentPage.getDepth();
    
    if(stopLevel==0 || stopLevel > currentLevel) {
      stopLevel = currentLevel;
    }
    while (startLevel < stopLevel) {
        Page page = currentPage.getAbsoluteParent(startLevel);
        if (page != null) {
            
          boolean isActivePage = page.equals(currentPage);
            
            /* Break if it reaches the currentPage */
      if (isActivePage) {
          break;
      }
      /* If the page has not been hidden in the navigation from page properties, add it to the list */
            if (isNotHidden(page)) {
                items.add(page);
            }
        }
        startLevel++;
    }
    return items;
  }
  
  private boolean isNotHidden(Page page) {
    return !page.isHideInNav();
  }
}
