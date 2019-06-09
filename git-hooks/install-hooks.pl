#!/usr/bin/perl
use strict;
use warnings;

system("rm ../.git/hooks/*.sample");

my $hookDir = "hooks";

opendir (DIR, $hookDir) or die $!;

my $hookName;
my $symlinkName;

while ($hookName = readdir(DIR)) {
    
    next if ($hookName =~ m/^\./);

    print "found hook: ".$hookName."\n";

    ($symlinkName) = (split m/\./, $hookName)[0];
    print "give symlinkName: ".$symlinkName."\n";

    system("ln -sf ../../git-hooks/hooks/".$hookName." ../.git/hooks/".$symlinkName."\n");
}

print "current Hooks:\n";
system("ls ../.git/hooks");

closedir(DIR);