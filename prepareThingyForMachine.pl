#!/usr/bin/perl
use Cwd qw(cwd);
my $dir = cwd;

############################################################
my $specificThingyBasePath = $dir."/thingy-build-system/machine/specificThingyInfo.js";
my $specificThingyBaseLink = $dir."/thingy-build-system/specificThingyInfo.js"; 

my $result = symlink($specificThingyBasePath, $specificThingyBaseLink);

############################################################
my $sourceInfoPath = $dir."/../sources/sourceInfo.js";
my $sourceInfoLink = $dir."/thingy-build-system/machine/sourceInfo.js"; 

$result = symlink($sourceInfoPath, $sourceInfoLink);

############################################################
$result  = `node thingy-build-system/producePackageJason.js`;

if($result == 0) {
    print "package.json for machine is ready to go :-)\n";
} else {
    print "An error occured!\nReturned: ".$result."\n";
}
