+++
date = '2025-08-14T10:56:15+06:30'
draft = false
title = 'Arch Linux Installation'
categories = ['tech', 'linux']
tags = ['arch linux', 'installation']
+++

{{< extlink "https://archlinux.org/" "Arch linux" >}} installation is not that hard if you do it simple as if:

- you don't need dual boot and just want to install it as first OS on your drive.
- your computer is not too old and it supports {{< extlink "https://wiki.archlinux.org/title/Partitioning#GUID_Partition_Table" "GPT" >}}, {{< extlink "https://wiki.archlinux.org/title/Unified_Extensible_Firmware_Interface" "UEFI" >}}, etc.
- you don't need LVM, system encryption or {{< extlink "https://wiki.archlinux.org/title/RAID" "RAID" >}}.
- you don't mind to read the wiki pages.

See also: {{< extlink "https://wiki.archlinux.org/title/Installation_guide" "Official Installation Guide" >}}

If so, it is done in 10 minutes (without downloading and installation time). In this tutorial, The Arch Linux is installed as

- no dual boot, single OS
- using {{< extlink "https://wiki.archlinux.org/title/Partitioning#GUID_Partition_Table" "GUID Partition Table (GPT)" >}} and {{< extlink "https://wiki.archlinux.org/title/Ext4" "EXT4" >}} filesystem. Assuming storage device is `/dev/sda`, partition table is as follows:
    - `/dev/sda1` BOOT Partition and to be mounted to `/boot`.
    - `/dev/sda2` ROOT Partition and to be mounted to `/`.
    - `/dev/sda3` SWAP Partition and no need to be mounted to.
    - `/dev/sda4` HOME Partition and to be mounted to `/home`.
- with {{< extlink "https://wiki.archlinux.org/title/Unified_Extensible_Firmware_Interface" "Unified Extensible Firmware Interface (UEFI)" >}} using {{< extlink "https://wiki.archlinux.org/title/Systemd-boot" "systemd-boot" >}} as {{< extlink "https://wiki.archlinux.org/title/Arch_boot_process" "bootloader" >}}
- keep it simple and stupid

### Preparing Installation Media {class="mt3rem"}

```text
# dd if=/path/to/archlinux-version-x86_64.iso of=/dev/sdb
```

### Boot up from the Installation Media {class="mt3rem"}

Getting the installation media booted up, choosing UEFI in boot menu if needed. How to get the installation booted up?

### Connect to Internet {class="mt3rem"}

To connect to internet (WiFi) using {{< extlink "https://wiki.archlinux.org/title/Iwd" "iwd" >}}.

```text
# iwctl
```

for more details, see: {{< extlink "https://wiki.archlinux.org/title/Iwd#Connect_to_a_network" "Connect to a network" >}}

### Partitioning and Formatting Partitions {class="mb025rem mt3rem"}
#### Partitioning

GPT fdisk is personally recommended for partitioning the disk. GPT fdisk— consisting of the `gdisk`, `cgdisk`, `sgdisk` and `fixparts` programs—is a set of text-mode partitioning tools. Assuming your device is /dev/sda, run the following command and follow on-screen instructions.

```text {class="mb3rem"}
# gdisk /dev/sda
```

#### Formatting Partitions

Partitioning the disk by `gdisk` is just creating partition table on the disk. Formatting is still needed. In other words, formatting is writing {{< extlink "https://wiki.archlinux.org/title/File_systems" "filesystem" >}} on the partition. In this tutorial, {{< extlink "https://wiki.archlinux.org/title/Ext4" "EXT4 Filesystem" >}} is used for all partition except `/boot` partition where bootlader's files will reside and which is created as {{< extlink "https://wiki.archlinux.org/title/EFI_system_partition" "EFI System Partition" >}}.

#### Example of Partitioning and Formatting

1. **BOOT Partition** /dev/sda1  
500MB or 1GB is recommended.  
Partition Type ef00  
Mounted to /boot  
Formatted as FAT32 filesystem  
`# mkfs.fat -F32 /dev/sda1`
2. **ROOT Partition** /dev/sda2  
30GB is recommended.  
Partition Type 8300  
Mounted to /  
Formatted as EXT4 filesystem  
`# mkfs.ext4 /dev/sda2`
3. **SWAP Partition** /dev/sda3  
8GB is recommended.  
Partition Type 8200  
No need to format and mount  
But make it swap partition  
`# mkswap /dev/sda3`
4. **HOME Partition** /dev/sda4  
Size depends on available space on the disk /dev/sda  
Partition Type 8300  
Mounted to /home  
Formatted as EXT4 filesystem  
`# mkfs.ext4 /dev/sda4`

```text {class="mb3rem"}
# mkfs.fat -F32 /dev/sda1
# mkfs.ext4 /dev/sda2
# mkswap /dev/sda3
# mkfs.ext4 /dev/sda4
```

### Mounting and Activating Swap

Mounting involves creating directories where the partitions will be mounted. Activating swap can be done by using swapon command.

1. Mount ROOT partition to `/mnt`.
2. Create directories where the next partitions will be mounted.
    - `/mnt/boot` for BOOT Partition
    - `/mnt/home` for HOME Partition
3. Mount BOOT and HOME partitions to `/mnt/boot` and `/mnt/home`.
4. Activate {{< extlink "https://wiki.archlinux.org/title/Swap" "SWAP" >}} partition using `swapon`.

```text {class="mb3rem"}
# mount /dev/sda2 /mnt
# mkdir /mnt/boot                
# mkdir /mnt/home                
# mount /dev/sda1 /mnt/boot                
# mount /dev/sda4/mnt/home
# swapon /dev/sda3
```

### Installing Base System {class="mt3rem"}

At this stage, base system can be installed. It is also recommended to install other useful packages such as `base-devel`, `nano`, `nvim`, `networkmanager`.

```text
# pacstrap /mnt base linux linux-firmware base-devel neovim networkmanager
```

### Configuration {class="mb025rem mt3rem"}

#### fstab

```text
# genfstab -U /mnt >> /mnt/etc/fstab
```

#### chroot {class="mt3rem"}

```text
# arch-chroot /mnt
```

### Timezone {class="mt3rem"}

```text
# ln -sf /usr/share/zoneinfo/Asia/Yangon /etc/localtime
# hwclock --systohc
```

### Uncomment Locale {class="mt3rem"}

```text
# nano /etc/locale.gen
```

Find locale you want and uncomment it. E.g. `en_US.UTF-8 UTF-8`. If nano is not available, run `pacman -S nano` to install it first.

```text
en_US.UTF-8 UTF-8
```

### Generate Locale {class="mt3rem"}

```text
# locale-gen
```

### Create Locale File {class="mt3rem"}

```text
# nano /etc/locale.conf
```

Write locales. E.g.:

```text
LANG=en_US.UTF-8
```

### Hostname {class="mt3rem"}

```text
# nano /etc/hostname
```

Write the hosename:

```text
myhostname
```

### Hosts {class="mt3rem"}

```text
# nano /etc/hosts
```

Edit like the followings:

```text
127.0.0.1  localhost
::1        localhost
127.0.1.1  myhostname.localdomain  myhostname
```

### Root Password {class="mt3rem"}

```text
# passwd
```

### Create New User {class="mt3rem"}

```text
# useradd -m -G wheel -s /bin/bash myusername
# passwd myusername
```

### Make User Sudoer {class="mt3rem"}

```text
# EDITOR=nano visudo
```

Uncomment the following line:

```text
## Uncomment to allow members of group wheel to execute any command
%wheel ALL=(ALL:ALL) ALL
```

### Bootloader {class="mb025rem mt3rem"}
#### Bootloader Installation

See: {{< extlink "https://wiki.archlinux.org/title/Systemd-boot" "Systemd-boot" >}} for more details. Below command would be working only if {{< extlink "https://wiki.archlinux.org/title/EFI_system_partition" "EFI System Partition (ESP)" >}} is mounted to `/boot` or `/efi`. Mounting `ESP` to `/boot` is the most recommended and simplest. Read {{< extlink "https://wiki.archlinux.org/title/EFI_system_partition#Typical_mount_points" "ESP Typical Mount Points" >}} for more knowledge.

```text
# bootctl install
```

When running `bootctl install`, systemd-boot will try to locate the ESP at `/efi`, `/boot`, and `/boot/efi`. Setting esp to a different location requires passing the `--esp-path=esp` option.
{class="mb3rem"}

#### Bootloader Entry File

```text
# nano /boot/loader/entries/arch.conf
```

Write the followings:

```text
title    Arch Linux
linux    /vmlinuz-linux
initrd   /initramfs-linux.img
options  root=/dev/sda2 rw
```

#### Exit, Unmount and Reboot {class="mt3rem"}

```text
# exit
# umount -R /mnt
# reboot
```

#### Post Installation {class="mt3rem"}

At this stage, the base installation finished. See {{< extlink "https://wiki.archlinux.org/title/General_recommendations" "General recommendations" >}} for system management directions and post-installation tutorials (like creating unprivileged user accounts, setting up a graphical user interface, sound or a touchpad). For a list of applications that may be of interest, see {{< extlink "https://wiki.archlinux.org/title/List_of_applications" "List of applications" >}}.
