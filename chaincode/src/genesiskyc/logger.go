package genesiskyc

import (
	"io/ioutil"
	"log"
	"os"
)

type Logger struct {
	debug   *log.Logger
	info    *log.Logger
	warning *log.Logger
	error   *log.Logger
}

// InitLogger : Initialize the logger
func InitLogger(logLevel string) Logger {
	l := logger{}

	errorHandle := os.Stdout
	warningHandle := ioutil.Discard
	infoHandle := ioutil.Discard
	debugHandle := ioutil.Discard

	if logLevel == "WARNING" {
		warningHandle = os.Stdout
	} else if logLevel == "INFO" {
		warningHandle = os.Stdout
		infoHandle = os.Stdout
	} else if logLevel == "DEBUG" {
		warningHandle = os.Stdout
		infoHandle = os.Stdout
		debugHandle = os.Stdout
	}

	l.debug = log.New(debugHandle, "DEBUG: ", log.Ldate|log.Ltime|log.Lshortfile)
	l.info = log.New(infoHandle, "INFO: ", log.Ldate|log.Ltime|log.Lshortfile)
	l.warning = log.New(warningHandle, "WARNING: ", log.Ldate|log.Ltime|log.Lshortfile)
	l.error = log.New(errorHandle, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile)
}

// Error : Log an error
func (l *Logger) Error(format string, a ...interface{}) {
	l.error.Printf(message, a)
}

// Warning : Log a warning
func (l *Logger) Warning(format string, a ...interface{}) {
	l.warning.Printf(message, a)
}

// Info : Log an info
func (l *Logger) Info(format string, a ...interface{}) {
	l.info.Printf(message, a)
}

// Debug : Log a debug
func (l *Logger) Debug(format string, a ...interface{}) {
	l.debug.Printf(format, a)
}
