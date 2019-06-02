// Transcrypt'ed from Python, 2019-06-01 22:56:09
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
var __name__ = '__main__';
export var normalize_sizes = function (sizes, dx, dy) {
	var total_size = sum (sizes);
	var total_area = dx * dy;
	var sizes = map (float, sizes);
	var sizes = map ((function __lambda__ (size) {
		return (size * total_area) / total_size;
	}), sizes);
	return list (sizes);
};
export var pad_rectangle = function (rect) {
	if (rect ['dx'] > 2) {
		rect ['x']++;
		rect ['dx'] -= 2;
	}
	if (rect ['dy'] > 2) {
		rect ['y']++;
		rect ['dy'] -= 2;
	}
};
export var layoutrow = function (sizes, x, y, dx, dy) {
	var covered_area = sum (sizes);
	var width = covered_area / dy;
	var rects = [];
	for (var size of sizes) {
		rects.append (dict ({'x': x, 'y': y, 'dx': width, 'dy': size / width}));
		y += size / width;
	}
	return rects;
};
export var layoutcol = function (sizes, x, y, dx, dy) {
	var covered_area = sum (sizes);
	var height = covered_area / dx;
	var rects = [];
	for (var size of sizes) {
		rects.append (dict ({'x': x, 'y': y, 'dx': size / height, 'dy': height}));
		x += size / height;
	}
	return rects;
};
export var layout = function (sizes, x, y, dx, dy) {
	return (dx >= dy ? layoutrow (sizes, x, y, dx, dy) : layoutcol (sizes, x, y, dx, dy));
};
export var leftoverrow = function (sizes, x, y, dx, dy) {
	var covered_area = sum (sizes);
	var width = covered_area / dy;
	var leftover_x = x + width;
	var leftover_y = y;
	var leftover_dx = dx - width;
	var leftover_dy = dy;
	return tuple ([leftover_x, leftover_y, leftover_dx, leftover_dy]);
};
export var leftovercol = function (sizes, x, y, dx, dy) {
	var covered_area = sum (sizes);
	var height = covered_area / dx;
	var leftover_x = x;
	var leftover_y = y + height;
	var leftover_dx = dx;
	var leftover_dy = dy - height;
	return tuple ([leftover_x, leftover_y, leftover_dx, leftover_dy]);
};
export var leftover = function (sizes, x, y, dx, dy) {
	return (dx >= dy ? leftoverrow (sizes, x, y, dx, dy) : leftovercol (sizes, x, y, dx, dy));
};
export var worst_ratio = function (sizes, x, y, dx, dy) {
	return max ((function () {
		var __accu0__ = [];
		for (var rect of layout (sizes, x, y, dx, dy)) {
			__accu0__.append (max (rect ['dx'] / rect ['dy'], rect ['dy'] / rect ['dx']));
		}
		return __accu0__;
	}) ());
};
export var squarify = function (sizes, x, y, dx, dy) {
	var sizes = list (map (float, sizes));
	if (len (sizes) == 0) {
		return [];
	}
	if (len (sizes) == 1) {
		return layout (sizes, x, y, dx, dy);
	}
	var i = 1;
	while (i < len (sizes) && worst_ratio (sizes.__getslice__ (0, i, 1), x, y, dx, dy) >= worst_ratio (sizes.__getslice__ (0, i + 1, 1), x, y, dx, dy)) {
		i++;
	}
	var current = sizes.__getslice__ (0, i, 1);
	var remaining = sizes.__getslice__ (i, null, 1);
	var __left0__ = leftover (current, x, y, dx, dy);
	var leftover_x = __left0__ [0];
	var leftover_y = __left0__ [1];
	var leftover_dx = __left0__ [2];
	var leftover_dy = __left0__ [3];
	return layout (current, x, y, dx, dy).concat(squarify (remaining, leftover_x, leftover_y, leftover_dx, leftover_dy));
};
export var padded_squarify = function (sizes, x, y, dx, dy) {
	var rects = squarify (sizes, x, y, dx, dy);
	for (var rect of rects) {
		pad_rectangle (rect);
	}
	return rects;
};

//# sourceMappingURL=squarify.map