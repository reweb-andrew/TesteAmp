#!/usr/bin/env bash

path="themes/$1/"
file="$path/CHANGELOG.md"

# verifica se foi parametrizado um template
if [[ ! $1 ]]; then
    printf "Selecione um template!"
    exit 1
fi

# verifica se o template informado existe
if [[ ! -d $path ]]; then
    echo "O template $1 não existe!"
    exit 1
fi

# caso não exista o arquivo do CHANGELOG.md, criamos o mesmo
# ou caso exista, removemos
if [[ ! -f "./${file}" ]]; then
    touch $file
else
    rm $file
fi

echo "# Modelo ${1//[!0-9]/}" >>${file}
echo "" >>${file}

# percorre as tags relacionada ao template
for current_tag in $(git tag -l "$1.*" --sort=-creatordate); do
    # recuperar o hash do commit relacionado a tag
    commit_hash=$(git show-ref -s ${current_tag})

    # recuperar a mensagem do commit
    commit_description=$(git log --format=%B -n 1 ${commit_hash})

    # formata descrição do commit para primeira letar em maiuscula
    commit_description_fuppercase="$(tr '[:lower:]' '[:upper:]' <<<${commit_description:0:1})${commit_description:1}"

    # recuperar a data do commit
    commit_date=$(git log -1 --pretty=format:'%ad' --date=short ${commit_hash})

    # formata a versão da tag
    version_tag=$(sed "s/$1.v//g" <<<"$current_tag")

    echo "## ${version_tag} - ${commit_date}:" >>${file}
    echo "" >>${file}

    # verifica se a descrição é um Merge
    if [ -z "${commit_description_fuppercase##*Merge branch*}" ]; then
        echo "- Mesclado alterações" >>${file}
    else
        echo "- ${commit_description_fuppercase}" >>${file}
    fi

    echo "" >>${file}
done
