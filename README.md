# to-do list project
Creating my own personal to do list app. The DataBase layer is run with MongoDB (currently locally), Backend is handled through Golang, and Frontend/Presentation is handled through React JS and Flexbox CSS. 

**Structure**
- DB is run locally on port 27071 (can be changed via a .env file in the main directory). This stores all the tasks.
- Backend runs a middle-man server on port 9000. Handles get and post to /api/task. Updates go to /api/task/{id}. Delete served via /api/deleteTask/{id}, and /api/deleteAllTasks is in future work.
- Frontend runs a server on 3000. This will allow incoming connections and serve the presentation layer, and will process user input and send to the backend server to process and communicate with backend.

# To Do
After getting a basic implementation, need to update the front-end server configuation with latest verison to resolve security issues.

## Future Work
1. Add more features to a task (ex due date, urgency, tag (like physical, work, etc))
2. Move DB to cloud (likely AWS due to MongoDB quick-start).
2.1 MongoDB seems to have a free cloud service, could move to this early on.
3. Add login so other people can use the app, practice OAuth2.
4. Potential to add mobile notifications if I use this app enough, send through my phone? This would require lots of mobile development, far down the road.

### References
As I wasn't familiar with building out an RESTful API and had no react experience, these two tutorials were useful when learning.
- [frontend](https://www.youtube.com/watch?v=E1E08i2UJGI)
- [backend](https://www.youtube.com/watch?v=8mEC1X5yLjY)
