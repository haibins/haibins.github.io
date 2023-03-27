#### 1.首先在项目目录下初始化本地仓库

git init

#### 2.添加所有文件( . 表示所有)

git add .

#### 3.提交所有文件到本地仓库

git commit -m "备注信息"

#### 4.连接到远程仓库

git remote add origin 你的远程仓库地址

#### 5.将项目推送到远程仓库

git push -u origin master

如果出现这个错误可能是因为远程仓库的README.md文件没有pull到本地仓库而导致的冲突
输入git pull --rebase origin master 将文件拉到本地后重新输入步骤5即可解决