#!/usr/bin/perl
use Cwd qw(cwd);
my $dir = cwd;

print "prepareThingyForMachine has been called!";
print "Here cwd is: $dir\n";