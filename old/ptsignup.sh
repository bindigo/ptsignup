#!/usr/bin/env bash

__test_email() {
    echo "Testing email aaa@abccc.com"
    curl -X GET "https://report.ptengine.com/ajax/userCheckRepeat.pt?loginEmail=aaa@abccc.com"

    echo
    echo "Testing email bin.wu@ptengine.com"
    curl -X GET "https://report.ptengine.com/ajax/userCheckRepeat.pt?loginEmail=bin.wu@ptengine.com"
}

__reg() {
  curl -X POST "http://archive.ptengine.com/templets/miapex/php/registe.php" \
    -d "email=aaaaaaaa@ccccccc.com&password=cccc123eeeeeee&timestamp=1443082593047&utm_source=&invite_uid=&source_detail=&source="
}

__send_email() {
  curl -X POST "http://archive.ptengine.com/templets/miapex/php/regSesSendEmail.php" \
    -d "email=bin.wu@ptengine.com&link=https://report.ptengine.com/activation/activation_form.htm?ptengine=dGVzdEBiYmJiYi5jb20=&password=&date=2015-9-26"
}

__main() {
  case $1 in
    email*)
      __test_email
      ;;
    reg*)
      __reg
      ;;
    send*)
      __send_email
      ;;
    *)
      echo "Usage: email|reg|send"
  esac
}

__main $@
