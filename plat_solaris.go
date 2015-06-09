package main

import (
	"fmt"
	"os/exec"
)

func startup() error {
	fmt.Println("Detected Solaris platform")
	return nil
}

func (task *TaskRun) generateCommand() (*exec.Cmd, error) {
	return task.unixCommand()
}
