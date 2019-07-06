#!/usr/bin/perl
use Cwd qw(cwd);
my $dir = cwd;

print "prepareThingyForCLI has been called!";
print "Here cwd is: $dir\n";