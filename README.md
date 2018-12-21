# Beadcrumb test
This test was solved on AEM6.2 with Service Pack1.
The Breadcrumb component has to be included on a page component in normal cases. But I have made it draggable on a page.

##Steps to test the component
* Deploy the code 
* open any existing page
* go to design mode and enable jpmctest component group
* Go to edit mode and drop the breadcrumb component
* The component should display the links to parent pages
* if the authors need to hide a page, they need to go and edit the page properties of that page and check "hide in navigation" checkbox.
* those pages will not be displayed on the breadcrumb

## Further improvements
If the authors don't want to reuse the hide in navigation checkbox from the page properties, then we can add another checkbox for "Hide in Breadcrumb" for the breadcrumb

## Modules

The main parts of the template are:

* core: Java bundle containing all core functionality like OSGi services, listeners or schedulers, as well as component-related Java code such as servlets or request filters.
* ui.apps: contains the /apps (and /etc) parts of the project, ie JS&CSS clientlibs, components, templates, runmode specific configs as well as Hobbes-tests

## How to build

To build all the modules run in the project root directory the following command with Maven 3:

    mvn clean install

If you have a running AEM instance you can build and package the whole project and deploy into AEM with  

    mvn clean install -PautoInstallPackage
    
Or to deploy it to a publish instance, run

    mvn clean install -PautoInstallPackagePublish
    
Or to deploy only the bundle to the author, run

    mvn clean install -PautoInstallBundle
