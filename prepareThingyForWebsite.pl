#!/usr/bin/perl
use Cwd qw(cwd);
my $dir = cwd;

print "prepareThingyForWebsite has been called!";
print "Here cwd is: $dir\n";
#should be toolset path
#system "cp thingy-base-files/website/* ../"
my $specificThingyBasePath = $dir."/thingy-build-system/website/specificThingyInfo.js";
my $specificThingyBaseLink = $dir."/thingy-build-system/specificThingyInfo.js"; 

my $result = symlink($specificThingyBasePath, $specificThingyBaseLink);
print $result."\n";

my $sourceInfoPath = $dir."/../sources/sourceInfo.js";
my $sourceInfoLink = $dir."/thingy-build-system/pwa/sourceInfo.js"; 

$result = symlink($sourceInfoPath, $sourceInfoLink);
print $result."\n";

$result  = `node thingy-build-system/producePackageJason.js`;
print $result."\n";
#TODO automatically apply some obvious configuration (name, git repository readme website)
#TODO add specific dependencies off sources
