use swc_core::common::comments::Comments;
use swc_core::ecma::ast::{Program, Str};
use swc_core::ecma::visit::{visit_mut_pass, VisitMut, VisitMutWith};
use swc_core::plugin::metadata::TransformPluginProgramMetadata;
use swc_core::plugin::plugin_transform;
use swc_core::plugin::proxies::PluginCommentsProxy;

struct Probe {
    comments: PluginCommentsProxy,
    total: usize,
    marker: bool,
}

impl VisitMut for Probe {
    fn visit_mut_program(&mut self, program: &mut Program) {
        // First pass: scan leading comments of every top-level item.
        let mut positions = vec![];
        match program {
            Program::Module(m) => {
                for item in &m.body {
                    positions.push(swc_core::common::Spanned::span(item).lo);
                }
            }
            Program::Script(s) => {
                for item in &s.body {
                    positions.push(swc_core::common::Spanned::span(item).lo);
                }
            }
        }
        for pos in positions {
            if let Some(cs) = self.comments.get_leading(pos) {
                for c in cs {
                    self.total += 1;
                    if c.text.contains("@marker") {
                        self.marker = true;
                    }
                }
            }
        }
        program.visit_mut_children_with(self);
    }

    fn visit_mut_str(&mut self, s: &mut Str) {
        if &*s.value == "COMMENT_PROBE" {
            let out = format!(
                "comments={} marker={}",
                self.total,
                if self.marker { "FOUND" } else { "MISSING" }
            );
            s.value = out.clone().into();
            s.raw = None;
        }
    }
}

#[plugin_transform]
fn process(mut program: Program, _metadata: TransformPluginProgramMetadata) -> Program {
    program.visit_mut_with(&mut Probe {
        comments: PluginCommentsProxy,
        total: 0,
        marker: false,
    });
    program
}
