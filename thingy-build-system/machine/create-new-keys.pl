#!/usr/bin/env perl

system("rm ./specific-commander-key*");
system("rm ./specific-webhook-handler-key*");


system("echo \"\n\" | ssh-keygen -t rsa -f ./specific-commander-key -N \"\";");
system("echo \"\n\" | ssh-keygen -t rsa -f ./specific-webhook-handler-key -N \"\";");
