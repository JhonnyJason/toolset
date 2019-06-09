#!/usr/bin/perl
use strict;
use warnings;

print "I am the pre-commit hook!\n";
my $filename = "version";
my $filepath = ""; # if we call git commit from root directory... :-S
#my $filepath = "../../";
my $openable = $filepath.$filename;
print "to open: ".$openable."\n";
unless(-e $openable) {
	print "file did not exist!\n";
	#no explicit error handling - it might be helpful
	# basicly no error should occur...
	open my $file, ">", $openable;
	print $file "0";
	close $file;
}
#no explicit error handling - it might be helpful
# basicly no error should occur...
open my $file, "+<", $openable;
my $versionNumber = <$file>;
print "versionNumber is: ".$versionNumber."\n";
$versionNumber++;
seek($file, 0, 0);
truncate($file, tell($file));
print $file $versionNumber;
close $file;

system("git add $filename;")
