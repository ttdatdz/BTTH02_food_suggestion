% 1. Định nghĩa công thức mon ăn (cả có dấu và không dấu)
recipe('Trung Chien', ['trung', 'hanh']).
recipe('Pho Bo', ['thit bo', 'banh pho', 'rau thom', 'hanh', 'que']).
recipe('Com Chien', ['com', 'trung', 'hanh', 'ca rot']).
recipe('Ga Ran', ['thit ga', 'bot']).
recipe('Lau Hai San', ['tom', 'muc', 'cua', 'rau thom', 'sa', 'la chanh']).
recipe('Banh Mi Xiu Mai', ['banh mi', 'thit heo', 'hanh', 'tuong ot']).
recipe('Ga Nuong Mat Ong', ['thit ga', 'mat ong', 'toi', 'nuoc mam']).
recipe('Com Ga Hoi An', ['com', 'thit ga', 'rau thom', 'nuoc mam', 'toi']).
recipe('Bun Bo Hue', ['bun', 'thit bo', 'gio heo', 'xuong bo', 'sa', 'ot']).

% 2. Luật thay thế nguyên liệu (cả có dấu và không dấu)
replacement('trứng', 'trung').
replacement('hành', 'hanh').
replacement('cà rốt', 'ca rot').
replacement('thịt gà', 'thit ga').
replacement('thịt bò', 'thit bo').
replacement('thịt heo', 'thit heo').
replacement('nước mắm', 'nuoc mam').
replacement('bánh phở', 'banh pho').
replacement('mật ong', 'mat ong').
replacement('hành lá', 'hanh la').
replacement('hành tỏi', 'hanh toi').
replacement('ớt', 'ot').
replacement('ớt khô', 'ot kho').
replacement('rau thơm', 'rau thom').
replacement('húng quế', 'hung que').
replacement('củ cải trắng', 'cu cai trang').
replacement('tương', 'tuong').
replacement('tương ớt', 'tuong ot').
replacement('sả', 'sa').
replacement('lá chanh', 'la chanh').
replacement('quế', 'que').

% 3. Các luật thay thế khác
replacement('thit ga', 'thit bo').
replacement('thit heo', 'thit bo').
replacement('nuoc mam', 'tuong').
replacement('banh pho', 'bun').
replacement('ca rot', 'cu cai trang').
replacement('mat ong', 'duong').
replacement('hanh', 'hanh la').
replacement('toi', 'hanh toi').
replacement('ot', 'ot kho').
replacement('rau thom', 'hung que').

% 4. Các luật xử lý logic
ingredient_available(Ingredient, Ingredients) :-
    member(Ingredient, Ingredients).
ingredient_available(Ingredient, Ingredients) :-
    replacement(Ingredient, Alternative),
    member(Alternative, Ingredients).

all_ingredients_available([], _).
all_ingredients_available([H|T], Ingredients) :-
    ingredient_available(H, Ingredients),
    all_ingredients_available(T, Ingredients).

% 5. Format output
format_recipe_output(Recipe-Ingredients, Formatted) :-
    atomic_list_concat(Ingredients, ',', IngredientsStr),
    format(atom(Formatted), "'~w'-[~w]", [Recipe, IngredientsStr]).

% 6. Gợi ý mon ăn với tất cả nguyên liệu có sẵn
suggest_recipe_with_ingredients(Ingredients, Recipe-Required) :-
    recipe(Recipe, Required),
    all_ingredients_available(Required, Ingredients).

% 7. Đánh giá độ ưu tiên (mon ít nguyên liệu hơn có ưu tiên cao hơn)
recipe_priority(Recipe, Priority) :-
    recipe(Recipe, Ingredients),
    length(Ingredients, Len),
    Priority is 1 / Len.

% 8. Gợi ý tất cả mon ăn có thể làm được, sắp xếp theo độ ưu tiên (phiên bản đã sửa)
suggest_all_recipes(Ingredients, SortedRecipes) :-
    findall(Priority-Recipe-Required, (
        recipe(Recipe, Required),
        all_ingredients_available(Required, Ingredients),
        recipe_priority(Recipe, Priority)
    ), Recipes),
    sort(1, @>=, Recipes, Sorted),
    extract_recipes(Sorted, SortedRecipes).

% Helper predicate để trích xuất thông tin công thức
extract_recipes([], []).
extract_recipes([_-Recipe-Ingredients|T], [Recipe-Ingredients|Rest]) :-
    extract_recipes(T, Rest).

% 9. Gợi ý mon ăn có sắp xếp ưu tiên (dùng cho API)
suggest_recipe_with_priority(Ingredients, Recipe) :-
    suggest_all_recipes(Ingredients, Recipes),
    member(Recipe-_, Recipes).