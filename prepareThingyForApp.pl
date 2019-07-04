#!/usr/bin/perl
use Cwd qw(cwd);
my $dir = cwd;

print "prepareThingyForApp has been called!\n";
print "Here cwd is: $dir\n";