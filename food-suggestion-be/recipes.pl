% recipes.pl

recipe('Trung Chien', ['trung', 'hanh']).
recipe('Pho Bo', ['thit bo', 'banh pho', 'rau thom', 'hanh', 'que']).
recipe('Com Chien', ['com', 'trung', 'hanh', 'ca rot']).
recipe('Ga Ran', ['thit ga', 'bot']).

replacement('thit ga', 'thit bo').
replacement('thit heo', 'thit bo').

ingredient_available(Ingredient, Ingredients) :-
    member(Ingredient, Ingredients).
ingredient_available(Ingredient, Ingredients) :-
    replacement(Ingredient, Alternative),
    member(Alternative, Ingredients).

all_ingredients_available([], _).
all_ingredients_available([H|T], Ingredients) :-
    ingredient_available(H, Ingredients),
    all_ingredients_available(T, Ingredients).

suggest_recipe(Ingredients, Recipe) :-
    recipe(Recipe, Required),
    all_ingredients_available(Required, Ingredients).
