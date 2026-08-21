use crate::{Config, NoopTransformVisitor};
use swc_core::common::plugin::metadata::TransformPluginMetadataContextKind;
use swc_core::ecma::ast::Program;
use swc_core::ecma::visit::visit_mut_pass;
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};

#[plugin_transform]
pub fn process_transform(program: Program, metadata: TransformPluginProgramMetadata) -> Program {
  let _config: Config = serde_json::from_str(
    &metadata
      .get_transform_plugin_config()
      .expect("failed to get plugin config for noop-swc"),
  )
  .expect("failed to parse plugin noop-swc config");

  let filename = metadata
    .get_context(&TransformPluginMetadataContextKind::Filename)
    .expect("failed to get filename");

  // Apply the noop transform which just prints the filename
  program.apply(visit_mut_pass(&mut NoopTransformVisitor::new(filename)))
}