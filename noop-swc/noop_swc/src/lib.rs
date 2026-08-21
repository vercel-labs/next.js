use serde::Deserialize;
use swc_core::ecma::ast::*;
use swc_core::ecma::visit::{VisitMut, VisitMutWith};

#[cfg(feature = "plugin")]
mod plugin;

/// Static plugin configuration.
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct Config {
  pub base_path: String,
}

impl Default for Config {
  fn default() -> Self {
    Self {
      base_path: Default::default(),
    }
  }
}

pub struct NoopTransformVisitor {
  filename: String,
}

impl NoopTransformVisitor {
  pub fn new(filename: impl AsRef<str>) -> Self {
    Self {
      filename: filename.as_ref().to_string(),
    }
  }
}

impl VisitMut for NoopTransformVisitor {
  fn visit_mut_program(&mut self, program: &mut Program) {
    // Print the filename being processed
    println!("Processing file: {}", self.filename);
    
    // Pass through the AST unchanged
    program.visit_mut_children_with(self);
  }
}