RESTful Routes

Name        Path            HTTP verb       Purpose         
=============================================================
Index       /dogs           GET             List all dogs
New         /dogs/new       GET             Show new dog form
Create      /dogs           POST            Create new dog
                                            then redirect
Show        /dogs/:id       GET             Show info about 
                                            specific dog
Edit        /dogs/:id/edit  GET             Show edit form 
                                            for one dog
Update      /dogs/:id       PUT             Update                                                       particular dog
                                            then redirect
Destroy     /dogs/:id       DELETE          delete
                                            particular dog
                                            then redirect


#Blog Index
*   Setup the Blog App
*   Create the Blog model
*   Add INDEX route and template
*   Add Simple Nav Bar

#Basic Layout
*   Add Header and Footer Partials
*   Include Semantic UI
*   Add Simple Nav

#Putting the C in CRUD
*   Add NEW route
*   Add NEW template
*   Add CREATE route
*   Add CREATE template

#SHOWtime
*   Add Show route
*   Add Show template
*   Add links to show page
*   Style show template

#Edit/Update
*   Add Edit Route
*   Add Edit Form
*   Add Update Route
*   Add Update Form
*   Add Method-Override

#DESTROY
*   Add Destroy Route
*   Add Edit and Destroy Links

#Final Updates
*   Sanitize blog body
*   Style Index
*   Update REST Table