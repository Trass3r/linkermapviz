var re = {};
import {__JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, dict, list, map, object, repr, set, sorted, sum, tuple} from './org.transcrypt.__runtime__.js';
import {chain, groupby} from './itertools.js';
import * as __module_re__ from './re.js';
__nest__ (re, '', __module_re__);
var __name__ = '__main__';
import * as squarify from './squarify.js';
export var Objectfile =  __class__('Objectfile', [object], {
	__module__: __name__,
	get __init__() {return __get__(this, function(self, section, offset, size, comment) {
		self.section = section.strip();
		self.offset = offset;
		self.size = size;
		self.path = tuple([null, null]);
		self.basepath = null;
		if (comment) {
			self.path = comment.match(/^(.+?)(?:\(([^\)]+)\))?$/); // /.../fullpath/libmpfr.a(round_near_x.o)
			self.basepath = self.path[1].split(/[\\/]/).pop(); // get object or library name
		}
		self.children = [];
	});},
	get __repr__() {return __get__(this, function(self) {
		return '<Objectfile {} {:x} {:x} {} {}>'.format(self.section, self.offset, self.size, self.path, repr(self.children));
	});}
});
export var parseSections = function (s) {
	var sections = [];
	var sectionre = re.compile ('(?P<section>.+?|.{14,}\n)[ ]+0x(?P<offset>[0-9a-f]+)[ ]+0x(?P<size>[0-9a-f]+)(?:[ ]+(?P<comment>.+))?\n+', re.I);
	var subsectionre = re.compile ('[ ]{16}0x(?P<offset>[0-9a-f]+)[ ]+(?P<function>.+)\n+', re.I);
	var pos = 0;
	while (true) {
		var m = sectionre.match (s);
		if (!(m)) {
			var nextpos = s.indexOf('\n') + 1;
			if (!nextpos)
				break;
			var pos = nextpos;
			s = s.slice(pos);
			continue;
		}
		var pos = m.end ();
		s = s.slice(pos);
		var section = m.group ('section');
		var v = m.group ('offset');
		var offset = (v !== null ? parseInt(v, 16) : null);
		var v = m.group ('size');
		var size = (v !== null ? parseInt(v, 16) : null);
		var comment = m.group ('comment');
		if (section == '*default*' || size <= 0)
			continue;
		var of = Objectfile (section, offset, size, comment);
		if (section.startswith (' ')) {
			sections[sections.length-1].children.append (of);
			while (true) {
				var m = subsectionre.match (s);
				if (!(m)) {
					break;
				}
				var pos = m.end ();
				s = s.slice(pos);
				var __left0__ = m.groups ();
				var offset = __left0__ [0];
				var function_ = __left0__ [1];
				var offset = parseInt(offset, 16);
				of.children.append(tuple([offset, function_]));
			}
		}
		else {
			sections.append (of);
		}
	}
	return sections;
};
var plt = Bokeh.Plotting;
export var main = function(fd)
{
	var sections = parseSections(fd);
	var importantSections = new set(['.text', '.data', '.bss', '.rodata']);
	var plots = [];
//	var whitelistedSections = list(filter((function __lambda__(x) {
//		return __in__(x.section, importantSections);
//	}), sections));

	// first show the important sections, then the rest sorted by size
	// whitelistedSections = sorted(sections, key = lambda x:(x.section in importantSections, x.size), reverse=True)
	var whitelistedSections = sorted(sections, __kwargtrans__({key: (function __lambda__(x) {
		return tuple([__in__(x.section, importantSections), x.size]);
	}), reverse: true}));
	var allObjects = list(chain(...map((function __lambda__(x) {
		return x.children;
	}), whitelistedSections)));
	var allFiles = list(set(map((function __lambda__(x) {
		return x.basepath;
	}), allObjects)));
	for (var s of whitelistedSections)
	{
		var objects = s.children;
		var groupsize = dict({});
		for (var [k, g] of groupby(sorted(objects, __kwargtrans__({key: (function __lambda__(x) {
			return x.basepath;
		})})), (function __lambda__(x) {
			return x.basepath;
		}))) {
			groupsize [k] = sum(map((function __lambda__(x) {
				return x.size;
			}), g));
		}
		objects.py_sort(__kwargtrans__({reverse: true, key: (function __lambda__(x) {
			return x.size;
		})}));
		var py_values = list(map((function __lambda__(x) {
			return x.size;
		}), objects));
		var totalsize = sum(py_values);
		var x = 0;
		var y = 0;
		var width = 1000;
		var height = 1000;
		var py_values = squarify.normalize_sizes(py_values, width, height);
		var padded_rects = squarify.padded_squarify(py_values, x, y, width, height);
		var left = list(map((function __lambda__(x) {
			return x ['x'];
		}), padded_rects));
		var top = list(map((function __lambda__(x) {
			return x ['y'];
		}), padded_rects));
		var rectx = list(map((function __lambda__(x) {
			return x ['x'] + x ['dx'] / 2;
		}), padded_rects));
		var recty = list(map((function __lambda__(x) {
			return x ['y'] + x ['dy'] / 2;
		}), padded_rects));
		var rectw = list(map((function __lambda__(x) {
			return x ['dx'];
		}), padded_rects));
		var recth = list(map((function __lambda__(x) {
			return x ['dy'];
		}), padded_rects));
		var files = list(map((function __lambda__(x) {
			return x.basepath;
		}), objects));
		var size = list(map((function __lambda__(x) {
			return x.size;
		}), objects));
		var children = list(map((function __lambda__(x) {
			return (x.children.length ? ','.join(map((function __lambda__(x) {
				return x [1];
			}), x.children)) : x.section);
		}), objects));
		var legend = list(map((function __lambda__(x) {
			return '{} ({})'.format(x.basepath, groupsize [x.basepath]);
		}), objects));

		var source = new Bokeh.ColumnDataSource({ data: {
            left: left,
            top: top,
            x: rectx,
            y: recty,
            width: rectw,
            height: recth,
            file: files,
            size: size,
            children: children,
            legend: legend,
        }});

        var hover = new Bokeh.HoverTool({ tooltips: [
            ["size", "@size"],
            ["file", "@file"],
            ["symbol", "@children"],
        ]});

        var p = plt.figure({ title: 'Linker map for section ' + s.section + ' (' + totalsize + ' bytes)',
                plot_width: width, plot_height: height,
                tools: [hover,'pan','wheel_zoom','box_zoom','reset'],
				x_range: [0, width], y_range: [0, height]
		});

        p.xaxis.visible = false;
        p.xgrid.visible = false;
        p.yaxis.visible = false;
        p.ygrid.visible = false;

		// no predefined palettes in BokehJS
		var palette = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5',
		               '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];
		var mapper = new Bokeh.CategoricalColorMapper({palette: palette, factors: allFiles});
		p.rect({field: 'x'}, {field: 'y'}, {field: 'width'}, {field: 'height'},
			{source: source, color: {field: 'file', transform: mapper}, legend: 'legend'});

        // set up legend, must be done after plotting
        p.legend.location = "top_left";
        p.legend.orientation = "horizontal";

        plots.push(p);
	}
	//	plt.show(plt.column([plots], {sizing_mode: "scale_width"}));
	const container = document.getElementById('plot');
	plt.show(plots, container);
};