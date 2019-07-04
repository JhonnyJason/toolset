#!/usr/bin/perl
use Cwd qw(cwd);
my $dir = cwd;

print "prepareThingyForService has been called!";
print "Here cwd is: $dir\n";