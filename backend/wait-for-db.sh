#!/bin/bash
set -e

host="$1"
shift
cmd=("$@")  # <-- simpan semua argumen tersisa sebagai array

echo "Menunggu MySQL di $host:3306..."

while ! (echo > /dev/tcp/"$host"/3306) &>/dev/null; do
  echo "Menunggu MySQL di $host:3306..."
  sleep 3
done

echo "MySQL siap - menjalankan perintah"
exec "${cmd[@]}"  # <-- jalankan array sebagai perintah terpisah
