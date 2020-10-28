import os.path
import pandas as pd
import string
import unidecode

#get film names
df_films = pd.read_csv('IMDb_DB.csv')
print(df_films.shape)
total=0
correct=0

# Using readlines()
file_name = open('list_films.txt', 'r')
Lines_name = file_name.readlines()
Lines_name = [l.replace('\n', '') for l in Lines_name]
file_ind = open('list_index.txt', 'r')
Lines_ind = file_ind.readlines()
Lines_ind = [l.replace('\n', '') for l in Lines_ind]

count = 0
# Strips the newline character
for ln, li in zip(Lines_name, Lines_ind):

    l = df_films.loc[df_films['original_title'] == ln]
    if l.empty:
        pass
        # print('No name for: ', ln)
    else:
        # print(type(l['_id'].values[0]), type(li))
        if l['_id'].values[0] != int(li):
            print('Index {} - {} for film {}'.format(l['_id'].values[0], li , ln))
        else:
            correct+=1

    total+=1

print('{}/{} names and indices are correct'.format(correct, total))
print('Done')
