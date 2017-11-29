# SJON-i
SJON-i is meant to be executed on a tablet mounted to a robot.
Elderly people can talk to SJON-i when they're bored, want to laugh or need help with something.
The incentive for SJON-i came from a school proiject, where the goal was to create telepresence to entertain the elderly.

# How to install
Installing SJON-i is quite easy.
1. install a small http server to be able to serve image and front files on local environment
  * _depends on node package manager, other http servers are possible too!_
  * OSX/Linux
    * open a terminal/command prompt and type `sudo npm install -g http-server`
  * Windows (you may need to run command prompt as administrator)
    * open a terminal/command prompt and type `npm install -g http-server`
2. clone the repository to use the code, or even make some improvements of your own
  * in the terminal/command prompt type `git clone https://github.com/nout-kleef/SJON-i.git`
3. run the http server
  * open a new terminal window (navigate to the repository on your device) and type `http-server`
4. your SJON-i clone is all set!
