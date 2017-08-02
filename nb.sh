#!/bin/bash

TMS="nodeSelfbot"
DIR="/home/thunder/selfbot"
SCRIPTUSER="thunder"
CURRENTUSER=$(whoami)

if [ "$CURRENTUSER" !=  "$SCRIPTUSER" ]
	then
	echo "Please Run This Script as User: $SCRIPTUSER NOT User:$CURRENTUSER"
	exit
fi

start(){
	tmux list-session 2>&1 | grep -q "^$TMS:" || tmux new-session -s $TMS -d
	tmux send-keys -t $TMS:0 "cd $DIR" C-m
	tmux send-keys -t $TMS:0 "echo Waiting for 3 seconds..." C-m
	tmux send-keys -t $TMS:0 "sleep 3" C-m
	tmux send-keys -t $TMS:0 "node bot.js" C-m
}

stop(){
	tmux send-keys C-c
	tmux kill-session -t $TMS
}


case "$1" in

	start|r)
	start
	;;

	stop|h)
	stop
	;;

	restart|rs)
	stop
	start
	;;

	attach|a|j|c)
	tmux a -t $TMS
	;;

	*)
	echo "$(basename $0) <start(Run)|stop(Halt)|restart(ReStart)|attatch(Attatch|Join|Connect)>"
	;;

esac
exit 0
