{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

    fenix = {
      url = "github:nix-community/fenix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };
  outputs =
    {
      self,
      fenix,
      nixpkgs,
    }:
    let
      system = "x86_64-linux";
      pkgs = (nixpkgs.legacyPackages.${system}.extend fenix.overlays.default);

      rust = (
        pkgs.fenix.stable.withComponents [
          "cargo"
          "rustc"
          "rustfmt"
          "clippy"
        ]
      );
    in
    {
      devShell.${system} =
        with pkgs;
        mkShell {
          name = "lxcat";
          buildInputs = [
            # Node
            nodejs-slim_22
            nodejs_22.pkgs.pnpm

            # Typescript
            nodePackages_latest.typescript
            nodePackages_latest.typescript-language-server

            # Formatting
            dprint
            # Rust
            rust
            rust-analyzer
          ];
        };
    };
}
