"use client";

import React, { useState, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const GITHUB_BASE =
  "https://github.com/nasa-ai-ml-stig/NASA_AI_ML_STIG/blob/main/public";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

interface Lecture {
  number: number;
  chapter?: number;
  title: string;
  speaker: string;
  affiliation: string;
  description: string;
  topics: string[];
  youtube?: string;
  links: { label: string; href: string }[];
  attribution?: { text: string; href: string; doi?: { label: string; href: string } };
}

const lectures: Lecture[] = [
  {
    number: 1,
    chapter: 1,
    title: "Overview",
    speaker: "Jesse Thaler",
    affiliation: "MIT",
    description:
      "A map of how AI is becoming a shared scientific language across the mathematical and physical sciences, framing the “two-way street” between using AI to do science and using science to understand AI, and where astronomy fits within it. Distills the NSF community white paper into concrete priorities for researchers, institutions, and funding agencies.",
    topics: [
      "AI as a shared language across the physical sciences",
      "The two-way street: AI for science and the science of AI",
      "Cross-cutting techniques: SBI, foundation models, uncertainty quantification",
      "Open research questions in the science of AI",
      "Recommendations for agencies, institutions, and researchers",
    ],
    youtube: "KOcacjfVlm0",
    links: [
      {
        label: "View Slides (PDF)",
        href: `${BASE_PATH}/Resources/Lecture1_Jesse_Thaler/The_Future_of_AI_and_MPS_Workshop.pdf`,
      },
      {
        label: "Read White Paper on arXiv",
        href: "https://arxiv.org/abs/2509.02661",
      },
    ],
  },
  {
    number: 2,
    chapter: 17,
    title: "LLM API Basics",
    speaker: "Yuan-Sen Ting",
    affiliation: "The Ohio State University",
    description:
      "An introduction to working with Large Language Models programmatically through APIs, from making your first calls to managing multi-turn conversations and crafting effective prompts for research tasks. Covers key generation parameters and vision models for astronomical image analysis.",
    topics: [
      "What APIs are and interacting with LLMs programmatically",
      "Key parameters: temperature, max tokens, system prompts",
      "Multi-turn conversations and context management",
      "Prompting strategies for research tasks",
      "Vision models for astronomical image analysis",
      "Handling rate limits and errors in production code",
    ],
    youtube: "Zh44bOt_mbE",
    links: [
      {
        label: "View/Download on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture2_Yuan-Sen_Ting/LLM_API_Basics_STIG.ipynb`,
      },
      {
        label: "View Slides",
        href: `${BASE_PATH}/Resources/Lecture2_Yuan-Sen_Ting/STIG_Lecture2_Slides/`,
      },
    ],
    attribution: {
      text: "Coding Essentials for Astronomers",
      href: "https://tingyuansen.github.io/coding_essential_for_astronomers/",
      doi: {
        label: "DOI: 10.5281/zenodo.17850426",
        href: "https://doi.org/10.5281/zenodo.17850426",
      },
    },
  },
  {
    number: 3,
    chapter: 18,
    title: "RAG & Function Tools",
    speaker: "Yuan-Sen Ting",
    affiliation: "The Ohio State University",
    description:
      "Move beyond plain text generation by giving LLMs function tools and Retrieval-Augmented Generation (RAG). Build astronomical calculation tools that Claude can call automatically and implement document-based Q&A grounded in your own sources.",
    topics: [
      "Function tools to extend LLM capabilities",
      "Astronomical calculation tools Claude can call",
      "Retrieval-Augmented Generation (RAG) for document Q&A",
      "Document chunking and embedding-based search",
      "Combining function tools with RAG",
      "Vector databases for production systems",
    ],
    youtube: "eic_kIll-ts",
    links: [
      {
        label: "View/Download on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture3_Yuan-Sen_Ting/LLM_Function_Tools_RAG_STIG.ipynb`,
      },
      {
        label: "View Slides",
        href: `${BASE_PATH}/Resources/Lecture3_Yuan-Sen_Ting/STIG_Lecture3_Slides/`,
      },
    ],
    attribution: {
      text: "Coding Essentials for Astronomers",
      href: "https://tingyuansen.github.io/coding_essential_for_astronomers/",
      doi: {
        label: "DOI: 10.5281/zenodo.17850426",
        href: "https://doi.org/10.5281/zenodo.17850426",
      },
    },
  },
  {
    number: 4,
    chapter: 20,
    title: "LLM as Agent",
    speaker: "Francisco Villaescusa-Navarro",
    affiliation: "Flatiron Institute CCA",
    description:
      "The conceptual shift from single-prompt LLMs to autonomous AI agents that perceive, reason, and act via the ReAct framework, and how connecting them yields multi-agent systems. Builds a LangGraph multi-agent system that iteratively generates and critiques astronomical research ideas.",
    topics: [
      "From single-prompt LLMs to autonomous agents",
      "Collaborative vs. competitive multi-agent architectures",
      "LangGraph: agents, graph state, and computational graphs",
      "Shared state for memory and context across agents",
      "A multi-agent system that generates and critiques research ideas",
      "Tracking token usage and mixing models to avoid echo chambers",
    ],
    youtube: "7hY8wLjGSdg",
    links: [
      {
        label: "View/Download on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture4_Francisco_Villaescusa-Navarro/AI_Agents_Multi-Agent_Systems_STIG.ipynb`,
      },
      {
        label: "View Slides (PDF)",
        href: `${BASE_PATH}/Resources/Lecture4_Francisco_Villaescusa-Navarro/AI_Agents_and_Multi-Agent_Systems.pdf`,
      },
    ],
  },
  {
    number: 5,
    chapter: 19,
    title: "Model Context Protocol",
    speaker: "Yuan-Sen Ting",
    affiliation: "The Ohio State University",
    description:
      "Package astronomical tools into standalone Model Context Protocol (MCP) servers that any compatible application can use, including Claude Desktop. Learn how MCP makes tools reusable beyond the notebook and enables cost-free interactive exploration through subscription-based access.",
    topics: [
      "The Model Context Protocol for packaging tools as servers",
      "Building astronomical MCP servers for Claude Desktop",
      "Subscription-based access for cost-free exploration",
      "Modular, reusable tool servers for research workflows",
      "Exposing both calculation tools and data resources",
    ],
    youtube: "ttKtiG6-V5U",
    links: [
      {
        label: "View/Download on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture5_Yuan-Sen_Ting/LLM_MCP_STIG.ipynb`,
      },
      {
        label: "View Slides",
        href: `${BASE_PATH}/Resources/Lecture5_Yuan-Sen_Ting/STIG_Lecture5_Slides/`,
      },
    ],
    attribution: {
      text: "Coding Essentials for Astronomers",
      href: "https://tingyuansen.github.io/coding_essential_for_astronomers/",
      doi: {
        label: "DOI: 10.5281/zenodo.17850426",
        href: "https://doi.org/10.5281/zenodo.17850426",
      },
    },
  },
  {
    number: 6,
    chapter: 2,
    title: "PyTorch and Autodifferentiation",
    speaker: "Phill Cargile",
    affiliation: "Harvard-Smithsonian CfA",
    description:
      "Why standard libraries like NumPy and SciPy fall short for machine learning, and how PyTorch solves the core problem of taking derivatives of arbitrary Python functions through automatic differentiation. Build, train, and evaluate a neural network from scratch using PyTorch tensors, autograd, and GPU acceleration.",
    topics: [
      "Limitations of NumPy/SciPy for machine learning",
      "Automatic differentiation and computational graphs",
      "Forward-pass vs. backward-pass autodiff",
      "PyTorch tensors and gradient tracking",
      "Building and training models with torch.nn and torch.optim",
      "Hardware acceleration: offloading to GPUs",
    ],
    youtube: "DVnRi8pszss",
    links: [
      {
        label: "View/Download Notebook on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture6_Phill_Cargile/PyTorch_Autodiff_STIG.ipynb`,
      },
      {
        label: "View Slides (PDF)",
        href: `${BASE_PATH}/Resources/Lecture6_Phill_Cargile/PyTorch_Autodiff_STIG.pdf`,
      },
    ],
  },
  {
    number: 7,
    chapter: 3,
    title: "JAX",
    speaker: "Phill Cargile",
    affiliation: "Harvard-Smithsonian CfA",
    description:
      "JAX as a library for writing general mathematical code that is fast, differentiable, and composable, contrasted with PyTorch's neural-network-centric design. Covers functional autodiff, JIT compilation via XLA, automatic vectorization, gradient-based optimization with Optax, and probabilistic inference with NumPyro.",
    topics: [
      "PyTorch vs. JAX: functional design and immutability",
      "Functional autodiff with grad and value_and_grad",
      "Just-In-Time (JIT) compilation via the XLA backend",
      "Automatic vectorization with vmap",
      "Gradient-based optimization with Optax",
      "Bayesian inference with NumPyro and the NUTS sampler",
    ],
    youtube: "M5MLjRAeoKw",
    links: [
      {
        label: "View/Download Notebook on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture7_Phill_Cargile/JAX_STIG.ipynb`,
      },
      {
        label: "View Slides (PDF)",
        href: `${BASE_PATH}/Resources/Lecture7_Phill_Cargile/JAX_STIG.pdf`,
      },
    ],
  },
  {
    number: 8,
    chapter: 4,
    title: "Inductive Biases",
    speaker: "John Wu",
    affiliation: "STScI",
    description:
      "How the architecture we choose injects physical intuition into a model, and why aligning a network's inductive bias with the problem is the secret to models that actually work. Grounds the comparison of MLPs, CNNs, RNNs, and Transformers in a concrete time-domain task: detecting exoplanet transits in synthetic light curves.",
    topics: [
      "Inductive bias and aligning architecture with physics",
      "Generating synthetic transiting-exoplanet light curves",
      "Inductive biases of MLPs, CNNs, RNNs, and Transformers",
      "Binary classification with BCE-with-logits",
      "Training and comparing architectures on transit detection",
    ],
    youtube: "z3qqoRzIV3M",
    links: [
      {
        label: "View/Download Notebook on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture8_John_Wu/Inductive_Biases_STIG.ipynb`,
      },
      {
        label: "View Slides (PDF)",
        href: `${BASE_PATH}/Resources/Lecture8_John_Wu/Inductive_Biases_STIG.pdf`,
      },
    ],
  },
  {
    number: 9,
    chapter: 5,
    title: "Convolutional Neural Networks",
    speaker: "John Wu",
    affiliation: "STScI",
    description:
      "Build a 2D Convolutional Neural Network from scratch in PyTorch to estimate the gas-phase metallicity of galaxies directly from imaging, replicating the main result of Wu & Boada (2019) on SDSS data. Covers the mechanics of CNN layers, optimization, data augmentation from physical symmetries, and transfer learning.",
    topics: [
      "Loading astronomical images as multi-channel tensors",
      "Physical inductive biases and D8 symmetry augmentation",
      "Building a CNN from scratch in PyTorch",
      "Convolutions, pooling, and batch normalization",
      "Optimization with gradient descent, momentum, and AdamW",
      "Transfer learning by fine-tuning a pre-trained vision model",
    ],
    youtube: "qsgXNIs2Wzc",
    links: [
      {
        label: "View/Download Notebook on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture9_John_Wu/Convolutional_Neural_Networks_STIG.ipynb`,
      },
    ],
  },
  {
    number: 10,
    chapter: 8,
    title: "Graph Neural Networks",
    speaker: "Tri Nguyen",
    affiliation: "Northwestern University",
    description:
      "Build neural networks that operate natively on graph-structured data through message passing, from a classic citation-network benchmark to a real astrophysics problem. Apply GNNs to point clouds to infer the mass and velocity of dark matter subhalos from the gravitational wakes they leave in stellar streams.",
    topics: [
      "Graph foundations: nodes, edges, and adjacency matrices",
      "Message passing and how GNNs learn representations",
      "Graph Convolutional vs. Graph Attention Networks",
      "Transductive node classification on the Cora network",
      "Building graphs from point clouds with k-nearest neighbors",
      "Inferring dark matter subhalo properties from stellar streams",
    ],
    youtube: "-J5t3CsgRP8",
    links: [
      {
        label: "View/Download Notebook 1 on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture10_Tri_Nguyen/GNN_Tutorial1_Cora_STIG.ipynb`,
      },
      {
        label: "View/Download Notebook 2 on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture10_Tri_Nguyen/GNN_Tutorial2_Streams_STIG.ipynb`,
      },
      {
        label: "View Slides (PDF)",
        href: `${BASE_PATH}/Resources/Lecture10_Tri_Nguyen/GNN_Tutorial_STIG.pdf`,
      },
    ],
  },
  {
    number: 11,
    chapter: 7,
    title: "Transformers",
    speaker: "Helen Qu",
    affiliation: "Flatiron Institute",
    description:
      "Understand self-attention as a sequence-to-sequence mixing operator and build a decoder-only (GPT-style) Transformer from scratch in PyTorch. Train a small autoregressive language model on character-level data and sample from it to generate novel text.",
    topics: [
      "Self-attention as a sequence-to-sequence mixing operator",
      "Scaled dot-product attention, causal masking, positional encoding",
      "Implementing a GPT-style Transformer block from scratch",
      "Training a small autoregressive language model",
      "Sampling from the model to generate novel text",
    ],
    youtube: "GfqGzho22z8",
    links: [
      {
        label: "View/Download Notebook on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture11_Helen_Qu/Transformers_STIG.ipynb`,
      },
      {
        label: "View Slides (PDF)",
        href: `${BASE_PATH}/Resources/Lecture11_Helen_Qu/Transformers_STIG.pdf`,
      },
    ],
  },
  {
    number: 12,
    chapter: 6,
    title: "Recurrent Neural Networks",
    speaker: "Daniel Muthukrishna",
    affiliation: "MIT / Harvard-Smithsonian CfA",
    description:
      "Build Recurrent Neural Networks from first principles for sequential, irregularly sampled astronomical time series, diagnosing the vanishing-gradient problem and the gated architectures (LSTM, GRU) that fix it. Train a GRU-based classifier on simulated Vera Rubin Observatory (LSST) light curves and evaluate real-time performance as data accumulates.",
    topics: [
      "Inductive biases of RNNs for sequential data",
      "Vanilla RNNs and the vanishing-gradient problem",
      "Gated architectures: LSTMs and GRUs for long-term memory",
      "Uni-directional vs. bi-directional RNNs",
      "Training a GRU classifier on simulated LSST light curves",
      "Evaluating real-time classification as time series evolve",
    ],
    youtube: "Pt3SWhc2hWg",
    links: [
      {
        label: "View/Download Notebook on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture12_Daniel_Muthukrishna/RNN_Tutorial_STIG.ipynb`,
      },
    ],
  },
  {
    number: 13,
    chapter: 9,
    title: "Equivariant Neural Networks",
    speaker: "Anna Scaife",
    affiliation: "U. of Manchester",
    description:
      "The theoretical foundations of equivariant neural networks, distinguishing invariance from equivariance and showing why standard CNNs are translation-equivariant but fail under rotation and reflection. Introduces the group structures that describe geometric transformations in astronomical data and why enforced equivariance beats data augmentation.",
    topics: [
      "Invariance vs. equivariance in astronomical feature maps",
      "Why CNNs are translation-equivariant but not rotation-equivariant",
      "Group structures (Affine and Euclidean groups) for transformations",
      "Why data augmentation is an incomplete substitute for equivariance",
      "Trade-offs: feature extraction, CNNs, and Group Equivariant CNNs",
    ],
    youtube: "HQwT2WsisAk",
    links: [
      {
        label: "View Slides (PDF)",
        href: `${BASE_PATH}/Resources/Lecture13_Anna_Scaife/Equivariant_Neural_Networks_STIG.pdf`,
      },
    ],
  },
  {
    number: 14,
    chapter: 10,
    title: "Equivariant Neural Networks (Application)",
    speaker: "Anna Scaife",
    affiliation: "U. of Manchester",
    description:
      "Turn equivariance theory into practice by building group-equivariant convolutional networks (G-CNNs) in PyTorch with the e2cnn library. Demonstrate programmatically that standard convolutions fail under rotation, then enforce rotational invariance through group pooling for classification.",
    topics: [
      "Invariance vs. equivariance in feature maps",
      "Showing convolutions are translation- but not rotation-equivariant",
      "Limits of data augmentation for rotational symmetry",
      "Building a group-equivariant CNN with the e2cnn library",
      "Group pooling to enforce rotational invariance",
    ],
    youtube: "6Y4adyDFU6A",
    links: [
      {
        label: "View/Download Notebook on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture14_Anna_Scaife/Equivariant_Neural_Networks_Application_STIG.ipynb`,
      },
    ],
  },
  {
    number: 15,
    chapter: 11,
    title: "Normalizing Flows",
    speaker: "Gregory Green",
    affiliation: "Westlake University",
    description:
      "Build normalizing flows that warp a simple base distribution into arbitrarily complex, high-dimensional distributions while retaining exact density evaluation and sampling. Implement an affine coupling layer and train a RealNVP flow in PyTorch, with a look ahead to continuous flows, flow matching, and conditional flows.",
    topics: [
      "Modeling high-dimensional distributions in astrophysics",
      "Invertible transformations and the change-of-variables formula",
      "Affine coupling layers for flexible, invertible networks",
      "Building and training a RealNVP flow in PyTorch",
      "Sampling and mapping data back to the latent space",
      "Advanced flows: continuous, flow matching, and conditional",
    ],
    youtube: "8HWQKOJuUkA",
    links: [
      {
        label: "View Slides",
        href: "https://gregreen.github.io/presentations/presentations/normalizing_flows_tutorial_2026y03m.html#/",
      },
      {
        label: "View/Download RealNVP Notebook on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture15_Gregory_Green/Normalizing_Flows_RealNVP_STIG.ipynb`,
      },
      {
        label: "View/Download Flow Matching Notebook on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture15_Gregory_Green/Normalizing_Flows_Flow_Matching_STIG.ipynb`,
      },
    ],
  },
  {
    number: 16,
    chapter: 12,
    title: "Diffusion Models",
    speaker: "Duo Xu",
    affiliation: "University of Toronto",
    description:
      "The physical intuition and mathematics of denoising diffusion probabilistic models (DDPMs) and score matching, motivated by astronomy's shift from a data-starved to a data-dominated science. Train a conditional U-Net to generate synthetic galaxy morphologies and build an image-to-image model to deconvolve and denoise degraded telescope observations.",
    topics: [
      "Forward (entropy) and reverse (generative) diffusion processes",
      "DDPMs and the score-matching framework",
      "Conditional U-Nets for synthetic galaxy generation",
      "Accelerated sampling and SDE vs. ODE samplers",
      "Evaluating generative quality with Frechet Inception Distance",
      "Image-to-image restoration of degraded observations (PSNR, SSIM)",
    ],
    youtube: "JNHNpjTA0q0",
    links: [
      {
        label: "View/Download Slides on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture16_Duo_Xu/Diffusion_Models_STIG.pdf`,
      },
      {
        label: "View/Download Galaxy Tutorial Notebook on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture16_Duo_Xu/Diffusion_Models_Galaxy_Tutorial_STIG.ipynb`,
      },
      {
        label: "View/Download Image-to-Image Notebook on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture16_Duo_Xu/Diffusion_Models_Image2Image_STIG.ipynb`,
      },
    ],
  },
  {
    number: 17,
    chapter: 13,
    title: "Flow Matching",
    speaker: "Tomasz Rozanski",
    affiliation: "ANU",
    description:
      "Flow matching as the next step in generative modeling, unifying normalizing flows, diffusion, and continuous flows under a single “probability path” perspective. Master the Conditional Flow Matching objective to train vector fields without solving ODEs, and build models that generate Color-Magnitude Diagrams for single and parameter-conditioned stellar populations.",
    topics: [
      "The probability-path view linking flows, diffusion, and CNFs",
      "The training bottleneck of continuous normalizing flows",
      "The Conditional Flow Matching objective for vector fields",
      "Predicting data vs. noise vs. velocity in astrophysical data",
      "Generating a Color-Magnitude Diagram for a single population",
      "Conditional generation from age and metallicity",
    ],
    youtube: "eAiXMEVAMHc",
    links: [
      {
        label: "View/Download Slides (PDF)",
        href: `${GITHUB_BASE}/Resources/Lecture17_Tomasz_Rozanski/Flow_Matching_STIG.pdf`,
      },
      {
        label: "View/Download Single Population Notebook on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture17_Tomasz_Rozanski/Flow_Matching_Single_Population_STIG.ipynb`,
      },
      {
        label: "View/Download Conditional Population Notebook on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture17_Tomasz_Rozanski/Flow_Matching_Conditional_Population_STIG.ipynb`,
      },
    ],
  },
  {
    number: 18,
    chapter: 14,
    title: "Simulation-Based Inference",
    speaker: "Tomasz Rozanski",
    affiliation: "ANU",
    description:
      "Simulation-Based Inference (SBI) uses neural networks to perform Bayesian inference when the likelihood is intractable but the forward model can be simulated. Walk through the end-to-end workflow, contrast Neural Posterior and Neural Likelihood Estimation, and apply NLE with MCMC to infer the age and metallicity of stellar populations from Color-Magnitude Diagrams.",
    topics: [
      "Traditional Bayesian inference vs. Simulation-Based Inference",
      "The five-step end-to-end SBI workflow",
      "Neural Posterior vs. Neural Likelihood Estimation",
      "Prior predictive checks for well-specified models",
      "Simulation-based calibration for reliable inference",
      "Inferring stellar population age and metallicity with NLE and MCMC",
    ],
    youtube: "bArKnWB92o8",
    links: [
      {
        label: "View/Download Slides (PDF)",
        href: `${GITHUB_BASE}/Resources/Lecture18_Tomasz_Rozanski/Simulation_Based_Inference_STIG.pdf`,
      },
      {
        label: "View/Download Ball Throw Notebook on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture18_Tomasz_Rozanski/SBI_Ball_Throw_STIG.ipynb`,
      },
      {
        label: "View/Download Stellar Population Notebook on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture18_Tomasz_Rozanski/SBI_Stellar_Population_STIG.ipynb`,
      },
    ],
  },
  {
    number: 19,
    chapter: 22,
    title: "AI and Scientific Publishing",
    speaker: "Licia Verde",
    affiliation: "U. of Barcelona/JCAP",
    description:
      "Examines scientific publishing as an industry with specific incentive structures and shows how large language models have disrupted its historical balance of effort. Covers the business of journals versus preprints, how metrics distort what counts as a good researcher, and the concrete ethical rules for using AI to write and review papers.",
    topics: [
      "The historical “effort balance” of publishing and how LLMs disrupted it",
      "Goodhart's Law and the Cobra Effect in bibliometrics",
      "Preprints vs. journals and the business model of publishing",
      "Ethical do's and don'ts for AI as author and as referee",
      "Rethinking the “atom” of scientific knowledge beyond the static PDF",
    ],
    youtube: "SoBprVD5lEI",
    links: [
      {
        label: "View Slides (PDF)",
        href: `${BASE_PATH}/Resources/Lecture19_Licia_Verde/AI_and_Scientific_Publishing_STIG.pdf`,
      },
    ],
  },
  {
    number: 20,
    chapter: 23,
    title: "The Meaning of Understanding in AI-Laden Science",
    speaker: "Siyu Yao & André Curtis-Trudel",
    affiliation: "Shanghai Jiao Tong University; U. of Cincinnati",
    description:
      "A philosophical examination of what it means to understand a physical phenomenon when an AI does the heavy lifting, disentangling explanation from understanding and surfacing the “illusions of understanding” AI can introduce. Introduces pragmatic understanding and the notion of pursuitworthiness for deciding which AI-generated hypotheses are worth scarce time and compute.",
    topics: [
      "Distinguishing explanation from understanding in discovery",
      "Illusions of understanding introduced by AI",
      "Pragmatic understanding: using a tool vs. knowing how it works",
      "Styles of pragmatic understanding astronomers adopt",
      "Pursuitworthiness of AI-generated hypotheses",
    ],
    youtube: "ahTP9fDR_0I",
    links: [
      {
        label: "View Slides (PDF)",
        href: `${BASE_PATH}/Resources/Lecture20_Siyu_Yao_Andre_Curtis-Trudel/The_Meaning_of_Understanding_in_AI_Laden_Science_STIG.pdf`,
      },
    ],
  },
  {
    number: 21,
    title: "NASA ASTRA Initiative",
    speaker: "Peter Kurczynski & Swara Ravindranath",
    affiliation: "NASA GSFC",
    description:
      "ASTRA is an innovative and fast-developing initiative to encourage new astrophysics mission concepts for consideration by NASA. Artificial Intelligence will have increasing impact on NASA astrophysics. Learn how you can become involved. This will be a brief presentation followed by discussion and Q&A.",
    topics: [
      "The ASTRA initiative: goals and scope",
      "New astrophysics mission concepts for NASA",
      "AI's growing role in NASA astrophysics",
      "Community engagement and involvement opportunities",
      "Open discussion and Q&A",
    ],
    youtube: "LsOPVqgf7Nw",
    links: [
      {
        label: "View Slides (PDF)",
        href: `${BASE_PATH}/Resources/Lecture21_Peter_Kurczynski_Swara_Ravindranath/ASTRA_Intro_STIG.pdf`,
      },
      {
        label: "ASTRA Initiative Homepage",
        href: "https://science.nasa.gov/astrophysics/programs/cosmic-origins/studies/astra-initiative/",
      },
      {
        label: "Mission Concepts (PDF)",
        href: "https://assets.science.nasa.gov/content/dam/science/astro/documents/ASTRA_Web_Update_2026-03-25.pdf",
      },
      {
        label: "Ad ASTRA Community Workshop (Sept 2026)",
        href: "https://conference.ipac.caltech.edu/community2026/",
      },
    ],
  },
  {
    number: 22,
    chapter: 15,
    title: "Reinforcement Learning Fundamentals",
    speaker: "Carol Cuesta-Lazaro",
    affiliation: "Institute for Advanced Study at Princeton / Flatiron Institute",
    description:
      "Builds the mathematical foundations of reinforcement learning from the ground up, for problems where an agent must act in a dynamic environment rather than learn from a static dataset. Derives the REINFORCE algorithm via the log-derivative trick, covers variance reduction and the policy-gradient/Actor-Critic/Q-learning landscape, and shows how classical RL powers modern LLMs through RLHF and RLVR.",
    topics: [
      "How RL differs from supervised learning: data distribution and rewards",
      "Core components: agent, environment, state, action, policy, reward",
      "Deriving REINFORCE with the log-derivative trick",
      "Variance reduction: baselines, reward-to-go, discounting, exploration",
      "Policy gradients vs. Actor-Critic vs. Q-learning",
      "RLHF and RLVR behind modern Large Language Models",
    ],
    youtube: "lrAt3rPPznI",
    links: [
      {
        label: "View Slides (PDF)",
        href: `${BASE_PATH}/Resources/Lecture22_Carol_Cuesta-Lazaro/Reinforcement_Learning_Fundamentals_STIG.pdf`,
      },
      {
        label: "View Handwritten Notes (PDF)",
        href: `${BASE_PATH}/Resources/Lecture22_Carol_Cuesta-Lazaro/Reinforcement_Learning_Fundamentals_Notes_STIG.pdf`,
      },
    ],
  },
  {
    number: 23,
    chapter: 16,
    title: "Reinforcement Learning Applications",
    speaker: "Carol Cuesta-Lazaro",
    affiliation: "Institute for Advanced Study at Princeton / Flatiron Institute",
    description:
      "A hands-on tutorial implementing reinforcement learning on a concrete example: training an agent to safely land a lunar module. Builds policy-gradient methods from REINFORCE through reward-to-go and baselines to a full Actor-Critic architecture, comparing their sample efficiency and connecting these control algorithms to reasoning in Large Language Models.",
    topics: [
      "Implementing the foundational REINFORCE policy gradient",
      "A policy network mapping continuous states to action probabilities",
      "Variance reduction with reward-to-go and baselines",
      "Actor-Critic with separate policy and value networks",
      "Comparing the sample efficiency of RL algorithms",
      "Connecting RL control to reasoning in LLMs",
    ],
    youtube: "lDphCPxn1BE",
    links: [
      {
        label: "View/Download Notebook on GitHub",
        href: `${GITHUB_BASE}/Resources/Lecture23_Carol_Cuesta-Lazaro/Reinforcement_Learning_from_Scratch_STIG.ipynb`,
      },
    ],
  },
  {
    number: 24,
    chapter: 21,
    title: "From Text to Spaceship",
    speaker: "Ryan McClelland",
    affiliation: "NASA GSFC",
    description:
      "How AI and computational design are merging to build the physical hardware of space missions, shifting from analyzing data to developing flight structures. Covers the “bits-to-atoms gap,” AI-evolved structures that trigger system-wide performance gains, and multi-agent architectures that design instruments and entire mission concepts from a text prompt, situated within NASA's broader ASTRA push.",
    topics: [
      "The “Text to Spaceship” paradigm: from data analysis to hardware",
      "The bits-to-atoms gap and why hardware AI has lagged software",
      "AI-evolved structures and the virtuous cycle of mass reduction",
      "A playbook for automating hardware engineering",
      "Multi-agent architectures for instrument and mission design",
      "Cultural shifts and NASA's broader ASTRA initiative",
    ],
    youtube: "xj4Irl3OFt8",
    links: [
      {
        label: "Davinci by Celedon Solutions (AI engineering platform)",
        href: "https://celedon.solutions/davinci/",
      },
      {
        label: "Synera (agentic AI for engineering workflows)",
        href: "https://www.synera.io/",
      },
    ],
  },
  {
    number: 25,
    title: "NASA's Open-Source Science Initiative",
    speaker: "Steven Crawford",
    affiliation:
      "Science Data Officer for Policy, Chief Science Data Office, NASA Headquarters",
    description:
      "A slide-based overview of NASA's Open-Source Science Initiative: what open science means in practice, how the federal Year of Open Science led into NASA's policy and infrastructure work, and how SMD is supporting open publications, data, software, meetings, tools, training, and community capacity through SPD-41a, core data services, open-source software funding, TOPS, and the NASA Open Science Certificate.",
    topics: [
      "Open science as shared research products and processes with security, privacy, reproducibility, and equity",
      "The 2023 Year of Open Science and its federal open-science goals",
      "NASA's implementation model: policy and governance, core services, incentives, and community",
      "SPD-41a requirements for open publications, research data, software, mission data, and meetings",
      "Science Explorer, Science Discovery Engine, and cross-division data and computing infrastructure",
      "TOPS, Open Science 101 modules, and the NASA Open Science Certificate",
    ],
    youtube: "3yR7ttMsJok",
    links: [
      {
        label: "View Slides (PDF)",
        href: `${BASE_PATH}/Resources/Lecture25_Steven_Crawford/NASAs_Open_Source_Science_Initiative_STIG.pdf`,
      },
      {
        label: "NASA Scientific Information Policy",
        href: "https://science.nasa.gov/researchers/science-data/science-information-policy",
      },
      {
        label: "NASA Open Science Trainings",
        href: "https://science.nasa.gov/open-science/training/",
      },
      {
        label: "Open Science Federal Portal",
        href: "https://open.science.gov/",
      },
    ],
  },
];

interface ScheduleRow {
  week: number;
  date: string;
  topic: string;
  speaker: string;
}

interface ModuleHeader {
  module: string;
}

type ScheduleEntry = ScheduleRow | ModuleHeader;

const schedule: ScheduleEntry[] = [
  { week: 1, date: "Nov 3", topic: "Overview", speaker: "Jesse Thaler, MIT" },
  { module: "Module 1: Large Language Models as Autonomous Agents" },
  { week: 2, date: "Nov 10", topic: "LLM API Basics", speaker: "Yuan-Sen Ting, OSU" },
  { week: 3, date: "Nov 17", topic: "RAG & Function Tools", speaker: "Yuan-Sen Ting, OSU" },
  { week: 4, date: "Nov 24", topic: "LLM as Agent", speaker: "Francisco Villaescusa-Navarro, Flatiron" },
  { week: 5, date: "Dec 8", topic: "Model Context Protocol (MCP)", speaker: "Yuan-Sen Ting, OSU" },
  { module: "Module 2: Deep Learning Frameworks" },
  { week: 6, date: "Dec 15", topic: "PyTorch and Autodifferentiation", speaker: "Phill Cargile, Harvard-Smithsonian" },
  { week: 7, date: "Dec 22", topic: "JAX", speaker: "Phill Cargile, Harvard-Smithsonian" },
  { module: "Module 3: Neural Network Basics" },
  { week: 8, date: "Jan 12", topic: "Inductive Biases", speaker: "John Wu, STScI" },
  { week: 9, date: "Jan 26", topic: "Convolutional Neural Networks (CNNs)", speaker: "John Wu, STScI" },
  { week: 10, date: "Feb 2", topic: "Graph Neural Networks (GNNs)", speaker: "Tri Nguyen, Northwestern" },
  { week: 11, date: "Feb 9", topic: "Transformers", speaker: "Helen Qu, Flatiron" },
  { week: 12, date: "Feb 23", topic: "Recurrent Neural Networks (RNNs)", speaker: "Daniel Muthukrishna, Harvard/MIT" },
  { module: "Module 4: Physics-Inspired Networks" },
  { week: 13, date: "Mar 2", topic: "Equivariant Neural Networks (Theory)", speaker: "Anna Scaife, U. of Manchester" },
  { week: 14, date: "Mar 9", topic: "Equivariant Neural Networks (Application)", speaker: "Anna Scaife, U. of Manchester" },
  { module: "Module 5: Generative Models" },
  { week: 15, date: "Mar 16", topic: "Normalizing Flows", speaker: "Gregory Green, Westlake" },
  { week: 16, date: "Mar 23", topic: "Diffusion Models", speaker: "Duo Xu, U. of Toronto" },
  { week: 17, date: "Mar 30", topic: "Flow Matching", speaker: "Tomasz Rozanski, ANU" },
  { week: 18, date: "Apr 6", topic: "Simulation-Based Inference", speaker: "Tomasz Rozanski, ANU" },
  { module: "Module 6: Ethics and Philosophy of Science" },
  { week: 19, date: "Apr 13", topic: "AI and Scientific Publishing", speaker: "Licia Verde, U. of Barcelona/JCAP" },
  { week: 20, date: "Apr 27", topic: "The Meaning of Understanding in AI-Laden Science", speaker: "Siyu Yao, SJTU & André Curtis-Trudel, U. Cincinnati" },
  { module: "Module 7: Reinforcement Learning" },
  { week: 22, date: "May 11", topic: "Reinforcement Learning Fundamentals", speaker: "Carol Cuesta-Lazaro, IAS/Flatiron" },
  { week: 23, date: "May 18", topic: "Reinforcement Learning Applications", speaker: "Carol Cuesta-Lazaro, IAS/Flatiron" },
  { module: "Module 8: AI Opportunities at NASA" },
  { week: 21, date: "May 4", topic: "NASA ASTRA Initiative", speaker: "Peter Kurczynski & Swara Ravindranath, NASA GSFC" },
  { week: 24, date: "Jun 1", topic: "From Text to Spaceship", speaker: "Ryan McClelland, NASA GSFC" },
  { week: 25, date: "Jun 29, 4 pm ET", topic: "Open Science and AI at NASA", speaker: "Steve Crawford, NASA SMD OCSDO" },
];

interface LeadershipPerson {
  name: string;
  affiliation: string;
  chair?: boolean;
  photo: string;
}

const leadership2026: LeadershipPerson[] = [
  { name: "Yuan-Sen Ting", affiliation: "The Ohio State University", chair: true, photo: "/images/team/yuan-sen-ting.jpg" },
  { name: "Jay Wadekar", affiliation: "University of Texas at Austin", chair: true, photo: "/images/team/jay-wadekar.jpg" },
  { name: "Ce Sui", affiliation: "The Ohio State University", photo: "/images/team/ce-sui.jpg" },
  { name: "Tri Nguyen", affiliation: "Northwestern University", photo: "/images/team/tri-nguyen.jpg" },
  { name: "Artem Poliszczuk", affiliation: "Stanford University", photo: "/images/team/artem-poliszczuk.jpg" },
  { name: "Julie Rolla", affiliation: "NASA Jet Propulsion Laboratory", photo: "/images/team/julie-rolla.jpg" },
];

const advisory2026: LeadershipPerson[] = [
  { name: "Moritz Münchmeyer", affiliation: "University of Wisconsin–Madison", photo: "/images/team/moritz-munchmeyer.jpg" },
  { name: "Bhuvnesh Jain", affiliation: "University of Pennsylvania", photo: "/images/team/bhuvnesh-jain.jpg" },
  { name: "Kelle Cruz", affiliation: "Hunter College, CUNY", photo: "/images/team/kelle-cruz.jpg" },
];

const leadership2025: LeadershipPerson[] = [
  { name: "Yuan-Sen Ting", affiliation: "The Ohio State University", chair: true, photo: "/images/team/yuan-sen-ting.jpg" },
  { name: "Jay Wadekar", affiliation: "University of Texas at Austin", chair: true, photo: "/images/team/jay-wadekar.jpg" },
  { name: "Andrew Saydjari", affiliation: "Princeton University", photo: "/images/team/andrew-saydjari.jpg" },
  { name: "Alex Gagliano", affiliation: "MIT", photo: "/images/team/alex-gagliano.jpg" },
  { name: "Carol Cuesta-Lazaro", affiliation: "Institute for Advanced Study / Flatiron Institute", photo: "/images/team/carol-cuesta-lazaro.jpg" },
  { name: "Georgios Valogiannis", affiliation: "University of Chicago", photo: "/images/team/georgios-valogiannis.jpg" },
  { name: "Siddharth Mishra-Sharma", affiliation: "Boston University", photo: "/images/team/siddharth-mishra-sharma.jpg" },
];

/* ------------------------------------------------------------------ */
/*  2026–2027 season: theme structure + fall schedule                  */
/* ------------------------------------------------------------------ */

interface SeasonTheme {
  title: string;
  when: string;
  lead: string;
  body: string;
  icon: string;
}

const seasonThemes: SeasonTheme[] = [
  {
    title: "Agentic AI: Fundamentals & Applications",
    when: "Fall 2026",
    lead: "Ce Sui",
    body: "The core track of the fall: what LLM agents are and how to work with them — hands-on sessions on agentic coding and research tools, transformers and pre-training, finetuning and reinforcement learning, retrieval and memory, tool use and MCP, multi-agent orchestration, interpretability, and ethics.",
    icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 6l1.035-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z",
  },
  {
    title: "AI for Scientific Instrumentation",
    when: "Winter–Spring 2027",
    lead: "Artem Poliszczuk",
    body: "Cross-disciplinary AI in the lab and in flight: edge AI and fast ML for scientific detectors, radiation-tolerant computing for space, ML for detector and optics design, algorithm–hardware co-design, neuromorphic computing, and autonomous robotics for NASA missions.",
    icon: "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9",
  },
  {
    title: "AI Policy & Collaboration",
    when: "Winter–Spring 2027",
    lead: "Julie Rolla",
    body: "The ecosystem around the science: funding opportunities and grant strategy, NSF and NSF–Simons AI institutes, private funders, ethics and reproducibility of the scientific method, AI pedagogy, and the national AI policy landscape.",
    icon: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z",
  },
  {
    title: "AI for Surveys & NASA Missions",
    when: "Winter–Spring 2027",
    lead: "Tri Nguyen",
    body: "AI for Roman, Rubin, and the missions ahead: foundation models for survey science, applications to survey science and operations, robust and interpretable methods at scale, and AI for HWO and planetary science.",
    icon: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z",
  },
  {
    title: "Town Halls & Interactive Sessions",
    when: "Throughout the year",
    lead: "Jay Wadekar",
    body: "Community-driven formats: town halls pairing contrasting views on the pros and cons of AI in research, and interactive working sessions on how to approach and carry out research with AI.",
    icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
  },
];

interface SeasonSession {
  date: string;
  topic: string;
  speaker?: string;
  affiliation?: string;
}

const fall2026: SeasonSession[] = [
  { date: "Sep 14", topic: "Foundations of LLM agents and state of the art", speaker: "Josh Speagle", affiliation: "University of Toronto" },
  { date: "Sep 21", topic: "Hands-on session I: agentic coding and research tools", speaker: "Christopher Stubbs", affiliation: "Harvard University" },
  { date: "Sep 28", topic: "Hands-on session II: agentic coding and research tools", speaker: "Serat Saad", affiliation: "The Ohio State University" },
  { date: "Oct 5", topic: "Transformers, attention, and pre-training", speaker: "Josh Nguyen", affiliation: "University of Pennsylvania" },
  { date: "Oct 12", topic: "No meeting" },
  { date: "Oct 19", topic: "Finetuning and reinforcement learning", speaker: "Moritz Münchmeyer", affiliation: "University of Wisconsin–Madison" },
  { date: "Oct 26", topic: "Retrieval and memory (RAG and beyond)", speaker: "Daniel Khashabi", affiliation: "Johns Hopkins University" },
  { date: "Nov 2", topic: "Tool use and MCP", speaker: "Adam Moss", affiliation: "University of Nottingham" },
  { date: "Nov 9", topic: "Skills for domains", speaker: "Kelle Cruz", affiliation: "Hunter College, CUNY" },
  { date: "Nov 16", topic: "Multi-agent systems and orchestration", speaker: "Boris Bolliet", affiliation: "University of Cambridge" },
  { date: "Nov 23", topic: "No meeting" },
  { date: "Nov 30", topic: "Ethics and challenges of agentic AI", speaker: "Paul Ginsparg", affiliation: "Cornell University" },
  { date: "Dec 7", topic: "Mechanistic interpretability", speaker: "Chirag Modi", affiliation: "New York University" },
  { date: "Dec 14", topic: "Town hall & interactive session", speaker: "David Hogg & Ben Wandelt", affiliation: "NYU & Johns Hopkins University" },
];

/* ------------------------------------------------------------------ */
/*  Helper                                                             */
/* ------------------------------------------------------------------ */

function isModuleHeader(entry: ScheduleEntry): entry is ModuleHeader {
  return "module" in entry;
}

/* ------------------------------------------------------------------ */
/*  Shared: logo mark, derived data                                    */
/* ------------------------------------------------------------------ */

function Logo({ className = "w-5 h-5" }: { className?: string }) {
  // AI "sparkle" (a four-point star) — reads as both AI and a star: AI × astronomy.
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.5 1.6 L11.5 7.5 L17.4 9.5 L11.5 11.5 L9.5 17.4 L7.5 11.5 L1.6 9.5 L7.5 7.5 Z" />
      <path d="M17.8 14 L18.7 16.6 L21.3 17.5 L18.7 18.4 L17.8 21 L16.9 18.4 L14.3 17.5 L16.9 16.6 Z" />
    </svg>
  );
}

interface ModuleGroup {
  module: string | null;
  num: string;
  title: string;
  rows: ScheduleRow[];
}

const moduleGroups: ModuleGroup[] = (() => {
  const out: ModuleGroup[] = [];
  let cur: ModuleGroup | null = null;
  for (const e of schedule) {
    if (isModuleHeader(e)) {
      const m = e.module.match(/^Module\s+(\d+):\s*(.*)$/);
      cur = { module: e.module, num: m ? m[1] : "", title: m ? m[2] : e.module, rows: [] };
      out.push(cur);
    } else {
      if (!cur) {
        cur = { module: null, num: "", title: "Overview", rows: [] };
        out.push(cur);
      }
      cur.rows.push(e);
    }
  }
  return out;
})();

const moduleCount = moduleGroups.filter((g) => g.module).length;

const INSTITUTIONS = [
  { name: "The Ohio State University", slug: "ohio-state" },
  { name: "University of Texas at Austin", slug: "ut-austin" },
  { name: "Princeton University", slug: "princeton" },
  { name: "Institute for Advanced Study", slug: "ias" },
  { name: "Flatiron Institute", slug: "flatiron" },
  { name: "MIT", slug: "mit" },
  { name: "Harvard University", slug: "harvard-cfa" },
  { name: "STScI", slug: "stsci" },
  { name: "Northwestern University", slug: "northwestern" },
  { name: "Australian National University", slug: "anu" },
  { name: "University of Manchester", slug: "manchester" },
  { name: "Westlake University", slug: "westlake" },
  { name: "University of Toronto", slug: "toronto" },
  { name: "University of Barcelona", slug: "barcelona" },
  { name: "Shanghai Jiao Tong University", slug: "sjtu" },
  { name: "University of Cincinnati", slug: "cincinnati" },
  { name: "Boston University", slug: "boston-university" },
  { name: "University of Chicago", slug: "uchicago" },
  { name: "Max Planck Institute", slug: "max-planck" },
  { name: "NASA Goddard", slug: "nasa-goddard" },
];

/* ------------------------------------------------------------------ */
/*  Navigation — broad floating bar                                    */
/* ------------------------------------------------------------------ */

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "About", href: "about" },
    { label: "Schedule", href: "schedule" },
    { label: "Textbook", href: "textbook" },
    { label: "Curriculum", href: "curriculum" },
    { label: "Team", href: "leadership" },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 px-3 sm:px-5 pt-3">
      <div
        className={`mx-auto max-w-[1480px] flex items-center justify-between gap-6 px-5 sm:px-9 rounded-2xl border transition-all duration-300 ${
          scrolled
            ? "py-3.5 bg-deep/95 backdrop-blur-md border-white/10 shadow-[0_16px_40px_-16px_rgba(12,35,64,0.65)]"
            : "py-5 bg-transparent border-transparent"
        }`}
      >
        <a href="#" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green to-green-light flex items-center justify-center shadow-sm">
            <Logo className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white tracking-tight">NASA AI/ML STIG</span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={`#${item.href}`}
              className="font-display text-sm font-medium px-4 py-2 rounded-full text-white/80 hover:text-green-light hover:bg-white/5 transition-all"
            >
              {item.label}
            </a>
          ))}
          <a
            href="mailto:AI-ML-STIG-join@lists.nasa.gov?subject=Join"
            className="font-display text-sm font-medium ml-2 px-5 py-2 rounded-full bg-green text-white hover:bg-teal-dark transition-all"
          >
            Join
          </a>
        </div>

        <button className="md:hidden p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden mx-auto max-w-[1400px] mt-2 bg-deep rounded-2xl border border-white/10 shadow-lg overflow-hidden">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <a key={item.href} href={`#${item.href}`} onClick={() => setMobileMenuOpen(false)} className="block font-display text-sm font-medium text-white/80 hover:text-green-light py-2 px-3 rounded-lg hover:bg-white/5">
                {item.label}
              </a>
            ))}
            <a href="mailto:AI-ML-STIG-join@lists.nasa.gov?subject=Join" className="block font-display text-sm font-medium py-2 px-3 rounded-lg bg-green text-white">Join</a>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

function HeroSection() {
  const stats = [
    { k: `${lectures.length}`, v: "Lectures" },
    { k: `${moduleCount}`, v: "Modules" },
    { k: "Open", v: "Access" },
  ];
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-deep">
      <img src={`${BASE_PATH}/images/generated/hero-bg.jpg`} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-deep via-deep/85 to-deep/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-deep via-transparent to-deep/50" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-16">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-display text-xs font-bold uppercase tracking-[0.22em] text-green-light">Cosmic Origins Program</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-green-light/25 bg-green-light/10 px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-wider text-green-light">
              <span className="h-1.5 w-1.5 rounded-full bg-green-light" />
              Fall 2026 schedule announced
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mt-6 mb-6 tracking-tight leading-[1.04]">
            <span className="text-green-light">NASA</span> AI/ML Science &amp; Technology Interest Group
          </h1>
          <p className="text-lg md:text-xl text-white/75 mb-9 max-w-2xl leading-relaxed">
            Building AI literacy for astronomical research through stackable,
            bite-sized modular training designed for the astronomy community.
          </p>
          <p className="-mt-4 mb-9 max-w-2xl font-display text-sm font-semibold text-white/80">
            Year two puts agentic AI at the center — hands-on agent workflows and
            the research frontier — then broadens cross-disciplinary, to AI for
            instrumentation, policy, and NASA missions and surveys. Weekly
            sessions resume Monday, September 14, 2026 at 4:00 PM ET.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#schedule" className="btn-primary">View the fall schedule</a>
            <a href="#curriculum" className="btn-on-dark">Browse all lectures</a>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/10 pt-7">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="font-display text-2xl md:text-3xl font-bold text-white">{s.k}</div>
                <div className="text-xs uppercase tracking-wider text-white/55 mt-0.5">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Value proposition band                                            */
/* ------------------------------------------------------------------ */

const STIG_NASA_PAGE = "https://science.nasa.gov/astrophysics/programs/cosmic-origins/community/artificial-intelligence-machine-learning-science-technology-interest-group-ai-ml-stig/";

function ValuePropBand() {
  const [active, setActive] = useState(0);
  const tabs = [
    {
      tab: "Cosmic Origins Program",
      tag: "NASA Astrophysics",
      title: "NASA's Cosmic Origins Program",
      body: "One of the three programs in NASA's Astrophysics division, Cosmic Origins studies how the universe's galaxies, stars, and cosmic structure formed and evolved — the science legacy of Hubble and the road toward the future Habitable Worlds Observatory.",
      image: "cosmic-origins.jpg",
      cta: { label: "NASA Cosmic Origins", href: "https://cor.gsfc.nasa.gov/" },
    },
    {
      tab: "The AI/ML STIG",
      tag: "A COPAG initiative",
      title: "A formal NASA community initiative",
      body: "The AI/ML STIG is a Science & Technology Interest Group of the Cosmic Origins Program Analysis Group (COPAG). Its premise: upskilling the community in AI is the most direct route to increasing the science return of NASA's missions — and as a COPAG group, it reports community needs and technology gaps back to NASA.",
      image: "why-literacy.jpg",
      cta: { label: "Official NASA STIG page", href: STIG_NASA_PAGE },
    },
    {
      tab: "Why it matters",
      tag: "The literacy gap",
      title: "The gap is adoption, not availability",
      body: "Community assessments single out education — not the availability of tools — as the principal barrier to adopting AI in astronomy. The STIG closes that gap with short, domain-specific, stackable tutorials that build genuine understanding, and the trust that real adoption requires.",
      image: "modules-graphic.jpg",
      cta: { label: "Explore the curriculum", href: "#curriculum" },
    },
  ];
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[320px_1fr] gap-10 lg:gap-14 items-start">
        {/* Left: heading + vertical tabs */}
        <div className="lg:pt-2">
          <span className="eyebrow">About</span>
          <h2 className="section-title mt-3 mb-8">A NASA initiative to bring AI into astronomy</h2>
          <div className="flex flex-col border-l border-black/10">
            {tabs.map((x, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`-ml-px text-left border-l-2 pl-5 py-3.5 font-display font-semibold transition-colors ${active === i ? "border-green text-ink" : "border-transparent text-ink/45 hover:text-ink/75"}`}
              >
                {x.tab}
              </button>
            ))}
          </div>
        </div>

        {/* Right: open editorial feature, panels stacked so height = tallest (no jump) */}
        <div className="grid">
          {tabs.map((tt, i) => (
            <div key={i} aria-hidden={active !== i} className={`col-start-1 row-start-1 transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              <div className="relative mb-8">
                <div className="absolute -inset-4 bg-green/10 blur-3xl rounded-full" />
                <img src={`${BASE_PATH}/images/generated/${tt.image}`} alt="" className="relative w-full aspect-[16/9] object-cover rounded-2xl shadow-[var(--shadow-card)]" />
              </div>
              <span className="inline-block font-display text-xs font-bold uppercase tracking-[0.18em] text-green mb-3">{tt.tag}</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-ink mb-4 tracking-tight">{tt.title}</h3>
              <p className="text-lg text-ink/70 leading-relaxed mb-6 max-w-2xl">{tt.body}</p>
              <a href={tt.cta.href} target={tt.cta.href.startsWith("http") ? "_blank" : undefined} rel={tt.cta.href.startsWith("http") ? "noopener noreferrer" : undefined} className="inline-flex items-center gap-2 font-display font-semibold text-teal hover:text-teal-dark transition-colors">
                {tt.cta.label}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  2026–2027 season — direction themes + fall schedule                */
/* ------------------------------------------------------------------ */

function SeasonSection() {
  return (
    <section id="schedule" className="py-24 relative bg-sand/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <span className="eyebrow">2026–2027 Series</span>
          <h2 className="section-title mt-3 mb-5">From foundations to agentic, cross-disciplinary AI</h2>
          <p className="text-lg text-ink/70 leading-relaxed">
            After a foundational first year, the new season puts <strong>agentic AI</strong> at the
            center: hands-on sessions with agentic coding and research tools, the techniques behind
            modern agents, and the questions they raise for science. The series then broadens
            cross-disciplinary — <strong>AI for scientific instrumentation</strong>,{" "}
            <strong>AI policy and collaboration</strong>, and <strong>AI for astronomical surveys
            and NASA missions</strong> — before closing the year with community town halls.
          </p>
        </div>

        {/* Theme cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {seasonThemes.map((t) => (
            <div key={t.title} className="card card-hover p-6 flex flex-col">
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="w-10 h-10 rounded-lg bg-green/10 text-green flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d={t.icon} /></svg>
                </span>
                <span className="text-[11px] font-display font-semibold uppercase tracking-wider text-ink/50 bg-ink/5 border border-ink/10 rounded-full px-2.5 py-1 text-right">{t.when}</span>
              </div>
              <h3 className="font-display text-lg font-bold text-ink leading-snug mb-2">{t.title}</h3>
              <p className="text-sm text-ink/65 leading-relaxed">{t.body}</p>
              <span className="mt-4 pt-4 border-t border-black/5 text-xs font-medium text-ink/45">Theme lead: {t.lead}</span>
            </div>
          ))}

          {/* Community card fills the grid and invites input on the rest of the year */}
          <div className="rounded-2xl border border-dashed border-green/40 bg-green/5 p-6 flex flex-col justify-center">
            <h3 className="font-display text-lg font-bold text-ink leading-snug mb-2">Suggest a speaker or topic</h3>
            <p className="text-sm text-ink/65 leading-relaxed mb-5">
              The winter–spring 2027 program is still taking shape. Join the community and help
              shape the series.
            </p>
            <a href="mailto:AI-ML-STIG-join@lists.nasa.gov?subject=Join" className="btn-primary self-start px-5 py-2.5 text-sm">Join the community</a>
          </div>
        </div>

        {/* Fall 2026 schedule */}
        <div className="rounded-2xl bg-deep overflow-hidden shadow-[var(--shadow-card-hover)]">
          <div className="px-6 md:px-8 py-6 border-b border-white/10">
            <span className="font-display text-xs font-bold uppercase tracking-[0.18em] text-green-light">Fall 2026 schedule</span>
            <h3 className="font-display text-xl md:text-2xl font-bold text-white mt-1">Mondays · 4:00 PM ET · Remote</h3>
          </div>
          <ul className="divide-y divide-white/5">
            {fall2026.map((s) => (
              <li key={s.date} className={`flex items-center gap-4 md:gap-6 px-6 md:px-8 py-3.5 ${!s.speaker ? "opacity-45" : ""}`}>
                <span className="w-16 shrink-0 font-display text-sm font-semibold text-green-light">{s.date}</span>
                <div className="min-w-0 flex-1">
                  <span className={`font-display font-semibold leading-snug ${!s.speaker ? "italic font-normal text-white/70" : "text-white"}`}>{s.topic}</span>
                  {s.speaker && (
                    <span className="block text-sm text-white/55 mt-0.5">
                      {s.speaker}{s.affiliation ? ` · ${s.affiliation}` : ""}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="px-6 md:px-8 py-5 bg-white/[0.03] border-t border-white/10 text-sm text-white/55">
            Winter–spring 2027 — instrumentation, policy, surveys &amp; missions, and town halls —
            will be announced as speakers confirm.
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Textbook feature                                                  */
/* ------------------------------------------------------------------ */

function TextbookFeature() {
  return (
    <section id="textbook" className="py-24 relative overflow-hidden bg-deep">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute top-0 right-1/4 w-[28rem] h-[28rem] bg-green/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-green-light/10 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <span className="font-display text-xs font-bold uppercase tracking-[0.22em] text-green-light">Open Textbook</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-3 mb-5 tracking-tight">Deep Learning for Astrophysics</h2>
          <p className="text-lg text-white/75 leading-relaxed mb-6">
            The lecture series, curated into a single, freely available textbook —
            running from computational foundations and deep-learning architectures
            through generative modeling and inference to large-language-model agents.
            The notebook chapters are runnable, with their original outputs preserved,
            and the exercises use real astronomical data.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <a href="https://deeplearning4astro.com" target="_blank" rel="noopener noreferrer" className="btn-primary">
              Read the textbook
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
            <a href="#curriculum" className="btn-on-dark">Browse the modules</a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-green/15 blur-3xl rounded-full" />
          <a href="https://deeplearning4astro.com" target="_blank" rel="noopener noreferrer" className="relative block rounded-xl overflow-hidden border border-white/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-1.5 px-4 py-3 bg-white/5 border-b border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
              <span className="ml-3 text-[11px] text-white/40">deeplearning4astro.com</span>
            </div>
            <img src={`${BASE_PATH}/images/textbook-reader.png`} alt="The Deep Learning for Astrophysics web reader" className="w-full" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Tabbed showcase (Green Street product-showcase pattern)            */
/* ------------------------------------------------------------------ */

const SHOWCASES = [
  {
    tab: "Recordings", tabSub: "Watch every session",
    title: "Every session, recorded and free",
    body: "All lectures are recorded and hosted on the NASA Cosmic Origins Program, with a video embedded in each lecture. Learn live on Monday afternoons, or on your own schedule.",
    bullets: ["Weekly one-hour lectures, fully recorded", "Embedded video on every lecture", "Open to the international community"],
    cta: { label: "Browse the lectures", href: "#curriculum" },
    image: "showcase-recordings.jpg", alt: "A researcher watching a recorded lecture",
  },
  {
    tab: "Notebooks", tabSub: "Runnable code, real data",
    title: "Hands-on notebooks on real astronomical data",
    body: "The tutorials are executable Jupyter notebooks, not toy examples. Exercises use galaxy images, transient light curves, radio-galaxy morphologies, and stellar streams — pairing the minimum theory a method needs with a worked astronomical example.",
    bullets: ["Executable notebooks with preserved outputs", "Real astronomical datasets throughout", "Theory paired with a worked example"],
    cta: { label: "See the lectures", href: "#curriculum" },
    image: "showcase-notebooks.jpg", alt: "Code analyzing astronomical data",
  },
  {
    tab: "Curriculum", tabSub: "Foundations to frontier",
    title: "Stackable, bite-sized modules",
    body: "A literacy progression of self-contained competencies — from computational foundations and deep-learning architectures through generative modeling and inference to reinforcement learning and large-language-model agents.",
    bullets: ["Modules across the full landscape", "Each module a self-contained competency", "From fundamentals to LLM agents"],
    cta: { label: "Explore the curriculum", href: "#curriculum" },
    image: "modules-graphic.jpg", alt: "A stackable, modular curriculum",
  },
];

const SHOWCASE_ICONS = [
  "M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 15.02V8.98a.75.75 0 011.14-.643l4.79 2.99a.75.75 0 010 1.286l-4.79 2.99A.75.75 0 019.75 15.02z",
  "M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z",
  "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z",
];

function TabbedShowcase() {
  const [active, setActive] = useState(0);
  const s = SHOWCASES[active];
  return (
    <section id="offerings" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="eyebrow">What you get</span>
          <h2 className="section-title mt-3">A program built for working researchers</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {SHOWCASES.map((t, i) => (
            <button key={i} onClick={() => setActive(i)} className={`flex items-center gap-3 text-left p-5 rounded-2xl border transition-all ${active === i ? "bg-cream-2 border-green ring-1 ring-green/30 shadow-[var(--shadow-card)]" : "bg-black/[0.035] border-black/8 hover:bg-black/[0.06]"}`}>
              <span className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center transition-colors ${active === i ? "bg-green text-white" : "bg-green/10 text-green"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d={SHOWCASE_ICONS[i]} /></svg>
              </span>
              <span>
                <span className="block font-display font-bold text-ink">{t.tab}</span>
                <span className="block text-sm text-ink/55">{t.tabSub}</span>
              </span>
            </button>
          ))}
        </div>

        <div key={active} className="card p-6 md:p-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="rounded-xl overflow-hidden border border-black/5">
            <img src={`${BASE_PATH}/images/generated/${s.image}`} alt={s.alt} className="w-full aspect-[4/3] object-cover" />
          </div>
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-ink mb-3 tracking-tight">{s.title}</h3>
            <p className="text-lg text-ink/70 leading-relaxed mb-5">{s.body}</p>
            <ul className="space-y-2.5 mb-7">
              {s.bullets.map((b, j) => (
                <li key={j} className="flex items-start gap-3 text-base text-ink/75 leading-relaxed">
                  <svg className="w-5 h-5 text-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {b}
                </li>
              ))}
            </ul>
            <a href={s.cta.href} className="inline-flex items-center gap-2 font-display font-semibold text-teal hover:text-teal-dark transition-colors">
              {s.cta.label}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Curriculum + Lecture Library (unified hierarchical layout)         */
/* ------------------------------------------------------------------ */

function LectureCard({ row, lecture, playing, onPlay }: { row: ScheduleRow; lecture?: Lecture; playing: boolean; onPlay: () => void }) {
  const yt = lecture?.youtube;
  return (
    <div className="overflow-hidden">
      {/* Top panel: video (left) + course description (right) */}
      <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-start">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-deep border border-black/5">
          {yt ? (
            playing ? (
              <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${yt}?autoplay=1`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
            ) : (
              <button onClick={onPlay} className="group absolute inset-0 w-full h-full" aria-label={`Play ${row.topic}`}>
                <img src={`https://img.youtube.com/vi/${yt}/hqdefault.jpg`} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <span className="absolute inset-0 bg-deep/40 group-hover:bg-deep/20 transition-colors" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-16 h-16 rounded-full bg-green/90 group-hover:bg-green flex items-center justify-center shadow-lg transition-all group-hover:scale-110">
                    <svg className="w-7 h-7 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </span>
                </span>
              </button>
            )
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/45 gap-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span className="text-[11px] uppercase tracking-wider">Materials pending</span>
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
            <span className="font-display font-bold text-green">Week {row.week}</span>
            <span className="text-ink/30">·</span>
            <span className="text-ink/55">{row.date}</span>
          </div>
          <h4 className="font-display text-2xl font-bold text-ink leading-snug mb-1.5">{row.topic}</h4>
          <div className="text-sm text-ink/55 mb-3">{lecture ? `${lecture.speaker} · ${lecture.affiliation}` : row.speaker}</div>
          {lecture && <p className="text-base text-ink/70 leading-relaxed">{lecture.description}</p>}
          {lecture?.chapter && (
            <a href={`https://deeplearning4astro.com/reader.html?ch=${lecture.chapter}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-4 font-display text-sm font-semibold text-teal hover:text-teal-dark transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              Read the textbook chapter
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          )}
          {!lecture && <p className="text-sm text-ink/40 italic">Materials will be added when available.</p>}
        </div>
      </div>

      {/* Full-width: topics + materials spanning both panels */}
      {lecture && (lecture.topics.length > 0 || lecture.links.length > 0) && (
        <div className="mt-6 pt-6 border-t border-black/5">
          {lecture.topics.length > 0 && (
            <>
              <h5 className="font-display text-xs font-semibold uppercase tracking-wider text-ink/40 mb-3">Topics covered</h5>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1.5 mb-5">
                {lecture.topics.map((t, i) => (<li key={i} className="text-base text-ink/65 flex items-start gap-2 leading-relaxed"><span className="mt-2.5 w-1 h-1 rounded-full bg-green flex-shrink-0" />{t}</li>))}
              </ul>
            </>
          )}
          {lecture.links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {lecture.links.map((link, i) => (
                <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className="chip">
                  {link.label}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              ))}
            </div>
          )}
          {lecture.attribution && (
            <p className="text-xs text-ink/40 mt-4 italic">
              Adapted from{" "}
              <a href={lecture.attribution.href} target="_blank" rel="noopener noreferrer" className="text-teal hover:text-teal-dark">{lecture.attribution.text}</a>
              {lecture.attribution.doi && (<>{" "}·{" "}<a href={lecture.attribution.doi.href} target="_blank" rel="noopener noreferrer" className="text-teal hover:text-teal-dark">{lecture.attribution.doi.label}</a></>)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* Per-module mini-icon that conveys the module's key idea. */
function ModuleIcon({ keyId, className = "w-5 h-5" }: { keyId: string; className?: string }) {
  if (keyId === "4") {
    // Physics-inspired networks — an atom (symmetry / physical priors)
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <ellipse cx="12" cy="12" rx="10" ry="4.4" />
        <ellipse cx="12" cy="12" rx="10" ry="4.4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.4" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  const d: Record<string, string> = {
    ov: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    "1": "M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z",
    "2": "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9",
    "3": "M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z",
    "5": "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 6l1.035-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z",
    "6": "M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z",
    "7": "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99",
    "8": "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z",
  };
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d={d[keyId] || d.ov} />
    </svg>
  );
}

function CurriculumLibrary() {
  const [activeTab, setActiveTab] = useState(-1);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [playingWeek, setPlayingWeek] = useState<number | null>(null);
  const lectureMap = new Map(lectures.map((l) => [l.number, l]));

  const activeEntries: ScheduleEntry[] = [];
  if (activeTab === -1) {
    activeEntries.push(...schedule);
  } else {
    const group = moduleGroups[activeTab];
    if (group.module) {
      activeEntries.push({ module: group.module });
    }
    activeEntries.push(...group.rows);
  }

  return (
    <section id="curriculum" className="py-24 relative bg-deep overflow-hidden">
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green/12 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-light/10 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="font-display text-xs font-bold uppercase tracking-[0.22em] text-green-light">Curriculum &amp; Lectures</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white mt-3 mb-4">Explore the growing lecture library</h2>
          <p className="text-lg text-white/65 max-w-3xl mx-auto leading-relaxed">
            One continuous collection of recordings, summaries, and materials from the STIG lecture series.
            Lectures from the 2026–2027 season will be added here as they take place —{" "}
            <a href="#schedule" className="text-green-light hover:text-green-light/80 font-medium underline underline-offset-4 decoration-green-light/40">see the fall 2026 schedule</a>.
          </p>
        </div>

        {/* Module filter cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 mb-10">
          {/* All Lectures Card */}
          <button
            onClick={() => { setActiveTab(-1); setExpandedWeek(null); setPlayingWeek(null); }}
            className={`text-left rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
              activeTab === -1
                ? "bg-green/15 border-green/50 ring-1 ring-green/40 shadow-[var(--shadow-soft)]"
                : "bg-white/5 border-white/10 hover:border-white/25 hover:-translate-y-0.5"
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <span className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${activeTab === -1 ? "bg-green text-white" : "bg-white/10 text-green-light"}`}>
                <Logo className="w-5 h-5" />
              </span>
              <span className="font-display text-[11px] font-bold uppercase tracking-wider text-green-light">Program</span>
            </div>
            <div className="font-display font-semibold text-white text-sm leading-snug line-clamp-2 min-h-[2.5rem]">All Lectures</div>
            <div className="text-xs text-white/45 mt-1">{lectures.length} lectures</div>
          </button>

          {/* Individual Module Cards */}
          {moduleGroups.map((g, i) => {
            const isActive = activeTab === i;
            const keyId = g.module ? g.num : "ov";
            const label = g.module ? `Module ${g.num}` : "Overview";
            return (
              <button
                key={i}
                onClick={() => { setActiveTab(i); setExpandedWeek(null); setPlayingWeek(null); }}
                className={`text-left rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-green/15 border-green/50 ring-1 ring-green/40 shadow-[var(--shadow-soft)]"
                    : "bg-white/5 border-white/10 hover:border-white/25 hover:-translate-y-0.5"
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <span className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${isActive ? "bg-green text-white" : "bg-white/10 text-green-light"}`}>
                    <ModuleIcon keyId={keyId} className="w-5 h-5" />
                  </span>
                  <span className="font-display text-[11px] font-bold uppercase tracking-wider text-green-light">{label}</span>
                </div>
                <div className="font-display font-semibold text-white text-sm leading-snug line-clamp-2 min-h-[2.5rem]">{g.title}</div>
                <div className="text-xs text-white/45 mt-1">{g.rows.length} lecture{g.rows.length > 1 ? "s" : ""}</div>
              </button>
            );
          })}
        </div>

        {/* Sub-bar showing the active group title */}
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3 min-w-0">
            <h3 className="font-display text-xl font-bold text-white truncate">
              {activeTab === -1 ? "All Lectures" : (moduleGroups[activeTab].module ? moduleGroups[activeTab].title : "Overview")}
            </h3>
            <span className="text-sm text-white/45 shrink-0">
              {activeTab === -1
                ? `${lectures.length} lectures in the library`
                : `${moduleGroups[activeTab].rows.length} lecture${moduleGroups[activeTab].rows.length > 1 ? "s" : ""}`
              }
            </span>
          </div>
        </div>

        {/* Vertical Accordion List */}
        <div className="space-y-4">
          {activeEntries.map((entry, idx) => {
            if (isModuleHeader(entry)) {
              const m = entry.module.match(/^Module\s+(\d+):\s*(.*)$/);
              const num = m ? m[1] : "";
              const title = m ? m[2] : entry.module;
              return (
                <div key={`mod-hdr-${idx}`} className="pt-8 first:pt-0 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-white/10 text-green-light flex items-center justify-center border border-white/10 shrink-0">
                      <ModuleIcon keyId={num} className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="block font-display text-[11px] font-bold uppercase tracking-wider text-green-light">Module {num}</span>
                      <h3 className="font-display text-lg md:text-xl font-bold text-white leading-tight">{title}</h3>
                    </div>
                  </div>
                </div>
              );
            }

            const lecture = lectureMap.get(entry.week);
            const isExpanded = expandedWeek === entry.week;

            return (
              <div
                key={`lecture-row-${entry.week}`}
                className={`card overflow-hidden transition-all duration-300 ${
                  isExpanded
                    ? "ring-2 ring-green/50 shadow-[var(--shadow-card-hover)]"
                    : "hover:border-white/20"
                }`}
              >
                {/* Accordion header button */}
                <button
                  onClick={() => {
                    setExpandedWeek(isExpanded ? null : entry.week);
                    if (isExpanded) setPlayingWeek(null);
                  }}
                  className="w-full text-left p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-black/[0.01] transition-colors"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <span className="shrink-0 bg-green/10 border border-green/20 text-green font-display font-bold text-xs px-2.5 py-1.5 rounded-lg">
                      Week {entry.week}
                    </span>
                    
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs text-ink/40 font-medium">{entry.date}</span>
                        {/* Textbook chapter removed from collapsed header */}
                      </div>
                      <h4 className="font-display text-base md:text-lg font-bold text-ink leading-snug hover:text-green transition-colors">
                        {entry.topic}
                      </h4>
                      <div className="text-sm text-ink/55 mt-1">
                        {lecture ? `${lecture.speaker} · ${lecture.affiliation}` : entry.speaker}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    {lecture ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal bg-green/10 border border-green/20 px-3 py-1 rounded-full">
                        {lecture.youtube && (
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                        )}
                        Video &amp; Materials
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/40 bg-ink/5 border border-ink/10 px-3 py-1 rounded-full">
                        Materials pending
                      </span>
                    )}

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-ink/5 text-ink/60 transition-transform duration-200 ${isExpanded ? "rotate-180 bg-green/10 text-green" : ""}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Expanded Detail Panel */}
                {isExpanded && (
                  <div className="border-t border-black/5 bg-cream/10 p-5 md:p-6 transition-all duration-300">
                    <LectureCard
                      row={entry}
                      lecture={lecture}
                      playing={playingWeek === entry.week}
                      onPlay={() => setPlayingWeek(entry.week)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Leadership — card grid (photo-ready)                               */
/* ------------------------------------------------------------------ */

function LeadershipGrid({ people, compact = false }: { people: LeadershipPerson[]; compact?: boolean }) {
  const initials = (name: string) => name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 ${compact ? "lg:grid-cols-3 max-w-4xl mx-auto" : "lg:grid-cols-4"} gap-6`}>
      {people.map((person) => (
        <div key={person.name} className="card card-hover overflow-hidden text-center group">
          <div className="relative aspect-square w-full overflow-hidden bg-sand">
            {person.photo ? (
              <img src={`${BASE_PATH}${person.photo}`} alt={person.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-display text-3xl font-bold text-teal bg-gradient-to-br from-green/15 to-green-light/25">{initials(person.name)}</div>
            )}
            {person.chair && (
              <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider text-white bg-green/90 backdrop-blur-sm rounded-full px-2.5 py-1">Co-Chair</span>
            )}
          </div>
          <div className="p-5">
            <div className="font-display font-bold text-ink leading-snug">{person.name}</div>
            <div className="text-sm text-ink/55 mt-1 leading-snug">{person.affiliation}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LeadershipSection() {
  const [activeYear, setActiveYear] = useState<"2026–2027" | "2025–2026">("2026–2027");

  return (
    <section id="leadership" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="eyebrow">Team</span>
          <h2 className="section-title mt-3 mb-5">Leadership across the series</h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-ink/60">
            Meet the current council and revisit the inaugural-year team.
          </p>
        </div>

        <div className="mb-12 flex justify-center">
          <div className="inline-flex rounded-full border border-black/10 bg-white p-1 shadow-[var(--shadow-soft)]" role="tablist" aria-label="Leadership Council year">
            {(["2026–2027", "2025–2026"] as const).map((year) => (
              <button
                key={year}
                type="button"
                role="tab"
                aria-selected={activeYear === year}
                onClick={() => setActiveYear(year)}
                className={`rounded-full px-5 py-2.5 font-display text-sm font-semibold transition-all ${
                  activeYear === year
                    ? "bg-deep text-white shadow-sm"
                    : "text-ink/55 hover:text-ink"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {activeYear === "2026–2027" ? (
          <div role="tabpanel">
            <div className="mb-14">
              <div className="mb-7 text-center">
                <h3 className="font-display text-2xl font-bold text-ink">2026–2027 Leadership Council</h3>
                <p className="mt-2 text-ink/55">Co-chairs and working council for the upcoming lecture year.</p>
              </div>
              <LeadershipGrid people={leadership2026} />
            </div>

            <div className="border-t border-black/10 pt-12">
              <div className="mb-7 text-center">
                <h3 className="font-display text-2xl font-bold text-ink">Advisory Council</h3>
                <p className="mt-2 text-ink/55">Senior advisors supporting the direction and continuity of the program.</p>
              </div>
              <LeadershipGrid people={advisory2026} compact />
            </div>
          </div>
        ) : (
          <div role="tabpanel">
            <div className="mb-7 text-center">
              <h3 className="font-display text-2xl font-bold text-ink">2025–2026 Leadership Council</h3>
              <p className="mt-2 text-ink/55">The council for the inaugural academic-year series.</p>
            </div>
            <LeadershipGrid people={leadership2025} />
          </div>
        )}

        <p className="text-center text-sm text-ink/50 mt-10">
          For inquiries, please contact:{" "}
          <a href="mailto:ting.74@osu.edu" className="text-teal hover:text-teal-dark font-medium">ting.74@osu.edu</a>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Institutions — scrolling marquee                                   */
/* ------------------------------------------------------------------ */

function InstitutionsMarquee() {
  const row = [...INSTITUTIONS, ...INSTITUTIONS];
  return (
    <section className="py-16 bg-deep overflow-hidden">
      <div className="text-center mb-8 px-6">
        <span className="font-display text-xs font-bold uppercase tracking-[0.22em] text-green-light">Across the community</span>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-2">Speakers and leaders from leading institutions</h2>
      </div>
      <div className="marquee-pause relative">
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-deep to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-deep to-transparent" />
        {/* auto-width chips + uniform logo height => consistent visual size */}
        <div className="flex gap-5 w-max animate-marquee items-stretch">
          {row.map((inst, i) => (
            <div key={i} title={inst.name} className="shrink-0 h-24 flex items-center justify-center rounded-2xl border border-black/5 bg-cream-2 px-10 shadow-[var(--shadow-soft)]">
              <img src={`${BASE_PATH}/images/logos/${inst.slug}.png`} alt={inst.name} className="h-10 w-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Participate — image cards                                          */
/* ------------------------------------------------------------------ */

function ParticipateSection() {
  const [active, setActive] = useState(0);
  const ways = [
    {
      tab: "Open membership",
      tag: "Open to all",
      title: "Become a member",
      body: "Open to the national and international community without regard to institutional affiliation, education, or career status. Astronomers, astrophysicists, data scientists, and anyone curious about AI in astronomy are welcome.",
      image: "participate-community.jpg",
      cta: { label: "Join the mailing list", href: "mailto:AI-ML-STIG-join@lists.nasa.gov?subject=Join" },
    },
    {
      tab: "Weekly meetings",
      tag: "Live · Mondays",
      title: "Join the weekly meeting",
      body: "The 2026–2027 series begins Monday, September 14, 2026, with a fall focused on agentic AI and weekly sessions through mid-December. Sessions run remotely on Mondays at 4:00 PM ET — join live to ask questions and help shape the discussion.",
      image: "participate-async.jpg",
      cta: { label: "NASA AI/ML STIG page", href: "https://science.nasa.gov/astrophysics/programs/cosmic-origins/community/artificial-intelligence-machine-learning-science-technology-interest-group-ai-ml-stig/" },
    },
    {
      tab: "Open materials",
      tag: "Free & open",
      title: "Use the recordings & notebooks",
      body: "Lecture recordings and available notebooks and slides remain freely accessible in one continuous library. Learn on your own schedule, reuse the materials to teach, and return as new lectures are added.",
      image: "showcase-recordings.jpg",
      cta: { label: "Browse the curriculum", href: "#curriculum" },
    },
  ];
  return (
    <section id="participate" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[300px_1fr] gap-10 lg:gap-14 items-start">
        {/* Left: heading + vertical tabs (GS "Beyond just data" style) */}
        <div className="lg:pt-2">
          <span className="eyebrow">Join us</span>
          <h2 className="section-title mt-3 mb-8">How to participate</h2>
          <div className="flex flex-col border-l border-black/10">
            {ways.map((x, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`-ml-px text-left border-l-2 pl-5 py-3.5 font-display font-semibold transition-colors ${active === i ? "border-green text-ink" : "border-transparent text-ink/45 hover:text-ink/75"}`}
              >
                {x.tab}
              </button>
            ))}
          </div>
        </div>

        {/* Right: card-less, image LEFT + text RIGHT (differs from Why's stacked layout).
            Panels stacked in one grid cell so height stays = tallest (no jump). */}
        <div className="grid">
          {ways.map((way, i) => (
            <div key={i} aria-hidden={active !== i} className={`col-start-1 row-start-1 grid md:grid-cols-2 gap-8 lg:gap-12 items-center transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              <div className="relative">
                <div className="absolute -inset-4 bg-green/10 blur-3xl rounded-full" />
                <img src={`${BASE_PATH}/images/generated/${way.image}`} alt="" className="relative w-full aspect-[4/3] object-cover rounded-2xl shadow-[var(--shadow-card)]" />
              </div>
              <div className="flex flex-col">
                <span className="self-start text-[11px] font-display font-bold uppercase tracking-wider text-teal bg-green/10 border border-green/20 rounded-full px-3 py-1 mb-4">{way.tag}</span>
                <h3 className="font-display text-2xl font-bold text-ink mb-3 leading-snug">{way.title}</h3>
                <p className="text-lg text-ink/65 leading-relaxed mb-6">{way.body}</p>
                <a href={way.cta.href} target={way.cta.href.startsWith("http") ? "_blank" : undefined} rel={way.cta.href.startsWith("http") ? "noopener noreferrer" : undefined} className="btn-primary self-start">
                  {way.cta.label}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer — CTA + multi-column with decorative pattern                */
/* ------------------------------------------------------------------ */

function Footer() {
  const cols = [
    { title: "Program", links: [
      { label: "About", href: "#about" }, { label: "Fall 2026 Schedule", href: "#schedule" },
      { label: "Curriculum", href: "#curriculum" }, { label: "Team", href: "#leadership" },
    ] },
    { title: "Materials", links: [
      { label: "Textbook", href: "https://deeplearning4astro.com" },
      { label: "GitHub Repository", href: "https://github.com/nasa-ai-ml-stig/NASA_AI_ML_STIG" },
      { label: "Community White Paper", href: "https://arxiv.org/abs/2509.02661" },
      { label: "Cosmic Origins Program", href: "https://cor.gsfc.nasa.gov/" },
    ] },
    { title: "Get involved", links: [
      { label: "Join the Mailing List", href: "mailto:AI-ML-STIG-join@lists.nasa.gov?subject=Join" },
      { label: "Weekly Meeting", href: "https://science.nasa.gov/astrophysics/programs/cosmic-origins/community/artificial-intelligence-machine-learning-science-technology-interest-group-ai-ml-stig/" },
      { label: "Contact", href: "mailto:ting.74@osu.edu" },
    ] },
  ];
  return (
    <footer className="relative bg-deep text-white pt-20 pb-10 overflow-hidden">
      {/* prominent decorative petal pattern */}
      <svg className="pointer-events-none absolute right-0 top-0 h-full w-[62%] text-green-light opacity-[0.10]" aria-hidden="true">
        <defs>
          <pattern id="petals" width="58" height="58" patternUnits="userSpaceOnUse">
            <path d="M0 58 A58 58 0 0 1 58 0" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M58 58 A58 58 0 0 0 0 0" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <linearGradient id="petalfade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="white" stopOpacity="0" />
            <stop offset="0.55" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <mask id="petalmask"><rect width="100%" height="100%" fill="url(#petalfade)" /></mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#petals)" mask="url(#petalmask)" />
      </svg>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* CTA */}
        <div className="text-center pb-16 mb-16 border-b border-white/10">
          <span className="font-display text-xs font-bold uppercase tracking-[0.22em] text-green-light">Join us</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white max-w-2xl mx-auto tracking-tight mt-3">Help build AI literacy in astronomy</h2>
          <p className="text-lg text-white/70 mt-4 max-w-xl mx-auto leading-relaxed">Open to the national and international community, regardless of institution, education, or career stage.</p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a href="mailto:AI-ML-STIG-join@lists.nasa.gov?subject=Join" className="btn-primary">Join the mailing list</a>
            <a href="https://science.nasa.gov/astrophysics/programs/cosmic-origins/community/artificial-intelligence-machine-learning-science-technology-interest-group-ai-ml-stig/" target="_blank" rel="noopener noreferrer" className="btn-on-dark">Join the weekly meeting</a>
          </div>
        </div>

        {/* Main */}
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green to-green-light flex items-center justify-center shadow-sm"><Logo className="w-6 h-6 text-white" /></div>
              <span className="font-display font-bold text-xl text-white">NASA AI/ML STIG</span>
            </div>
            <p className="text-sm text-white/55 leading-relaxed mb-5">Building AI literacy for astronomical research through stackable, domain-specific training under the NASA Cosmic Origins Program.</p>
            <p className="font-display text-xs font-semibold uppercase tracking-wider text-white/40">Mondays · 4:00 PM ET · Resumes Sep 14, 2026 · Remote · Open to all</p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-green-light mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}><a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined} className="text-sm text-white/65 hover:text-green-light transition-colors">{l.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-7 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/45">&copy; 2026 NASA Cosmic Origins AI/ML Science and Technology Interest Group</p>
          <a href="#top" className="text-xs font-display font-semibold uppercase tracking-wider text-white/45 hover:text-green-light transition-colors">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <main id="top" className="min-h-screen bg-cream">
      <Navigation />
      <HeroSection />
      <ValuePropBand />
      <SeasonSection />
      <TextbookFeature />
      <TabbedShowcase />
      <CurriculumLibrary />
      <LeadershipSection />
      <InstitutionsMarquee />
      <ParticipateSection />
      <Footer />
    </main>
  );
}
